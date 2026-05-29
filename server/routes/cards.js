import express from "express";
import Card from "../models/Card.js";
import Listing from "../models/Listing.js";
import PriceHistory from "../models/PriceHistory.js";
import { median, priceTrend } from "../utils/pricing.js";

const router = express.Router();

function buildSearchQuery(search) {
    if (!search || !String(search).trim()) return {};

    const searchableFields = ["group", "idol", "album", "version", "cardType", "rarity", "aliases"];
    const terms = String(search).trim().split(/\s+/).map(escapeRegex);

    return {
        $and: terms.map((term) => ({
            $or: searchableFields.map((field) => ({
                [field]: { $regex: term, $options: "i" },
            })),
        })),
    };
}

function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function enrichCardsWithPricing(cards) {
    const cardIds = cards.map((card) => card._id);

    const histories = await PriceHistory.find({ cardId: { $in: cardIds } })
        .sort({ soldDate: -1 })
        .lean();
    const listingSummaries = await Listing.aggregate([
        {
            $match: {
                cardId: { $in: cardIds },
                status: "active",
            },
        },
        {
            $group: {
                _id: "$cardId",
                activeListingCount: { $sum: 1 },
                lowestListingPrice: { $min: "$price" },
            },
        },
    ]);

    const historyByCard = new Map();
    const listingByCard = new Map(
        listingSummaries.map((summary) => [
            String(summary._id),
            {
                activeListingCount: summary.activeListingCount,
                lowestListingPrice: summary.lowestListingPrice,
            },
        ])
    );

    for (const entry of histories) {
        const key = String(entry.cardId);
        if (!historyByCard.has(key)) {
            historyByCard.set(key, []);
        }
        historyByCard.get(key).push(entry);
    }

    return cards.map((card) => {
        const cardHistory = historyByCard.get(String(card._id)) ?? [];
        const recentPrices = cardHistory.slice(0, 20).map((entry) => entry.price);
        const latestTwo = cardHistory.slice(0, 2).map((entry) => entry.price);
        const trendData = priceTrend(latestTwo);
        const estimatedMarketValue = median(recentPrices);
        const listingSummary = listingByCard.get(String(card._id));

        return {
            ...card.toObject(),
            estimatedMarketValue,
            lowestAsk: listingSummary?.lowestListingPrice ?? card.askingPrice ?? estimatedMarketValue,
            activeListingCount: listingSummary?.activeListingCount ?? 0,
            lastSale: trendData.lastSale,
            trend: trendData.trend,
            trendPercent: trendData.trendPercent,
            priceCount: recentPrices.length,
        };
    });
}

// GET homepage feed with pricing
router.get("/feed", async (req, res) => {
    try {
        const { search } = req.query;
        const query = buildSearchQuery(search);

        const cards = await Card.find(query).sort({ createdAt: -1 });
        const feed = await enrichCardsWithPricing(cards);

        res.json(feed);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch card feed",
            error: error.message,
        });
    }
});

// GET group summaries for homepage
router.get("/groups", async (req, res) => {
    try {
        const groups = await Card.aggregate([
            {
                $group: {
                    _id: "$group",
                    cardCount: { $sum: 1 },
                },
            },
            { $sort: { cardCount: -1, _id: 1 } },
        ]);

        res.json(
            groups.map((group) => ({
                name: group._id,
                cardCount: group.cardCount,
            }))
        );
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch groups",
            error: error.message,
        });
    }
});

// GET all cards
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;
        const query = buildSearchQuery(search);

        const cards = await Card.find(query)
            .sort({
                group: 1,
                idol: 1,
                album: 1,
            })
            .lean();
        const listingSummaries = await Listing.aggregate([
            {
                $match: {
                    cardId: { $in: cards.map((card) => card._id) },
                    status: "active",
                },
            },
            {
                $group: {
                    _id: "$cardId",
                    activeListingCount: { $sum: 1 },
                    lowestListingPrice: { $min: "$price" },
                },
            },
        ]);
        const listingByCard = new Map(listingSummaries.map((summary) => [String(summary._id), summary]));

        res.json(
            cards.map((card) => ({
                ...card,
                activeListingCount: listingByCard.get(String(card._id))?.activeListingCount ?? 0,
                lowestAsk: listingByCard.get(String(card._id))?.lowestListingPrice ?? card.askingPrice ?? null,
            }))
        );
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch cards",
            error: error.message,
        });
    }
});

// POST create a card/listing
router.post("/", async (req, res) => {
    try {
        const {
            group,
            idol,
            album,
            version = "",
            cardType = "Photocard",
            rarity = "Standard",
            condition = "Near Mint",
            askingPrice,
            imageUrl = "",
            aliases = [],
        } = req.body;

        if (!group || !idol || !album) {
            return res.status(400).json({
                message: "Group, idol, and album are required",
            });
        }

        const parsedAskingPrice =
            askingPrice === "" || askingPrice === null || askingPrice === undefined
                ? null
                : Number(askingPrice);

        if (parsedAskingPrice !== null && (Number.isNaN(parsedAskingPrice) || parsedAskingPrice < 0)) {
            return res.status(400).json({
                message: "Asking price must be a positive number",
            });
        }

        const aliasList = Array.isArray(aliases)
            ? aliases
            : String(aliases)
                  .split(",")
                  .map((alias) => alias.trim())
                  .filter(Boolean);

        const card = await Card.create({
            group: group.trim(),
            idol: idol.trim(),
            album: album.trim(),
            version: version.trim(),
            cardType: cardType.trim(),
            rarity: rarity.trim(),
            condition: condition.trim(),
            askingPrice: parsedAskingPrice,
            imageUrl: imageUrl.trim(),
            aliases: aliasList,
        });

        res.status(201).json(card);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create card listing",
            error: error.message,
        });
    }
});

// GET active listings for one official catalog card
router.get("/:cardId/listings", async (req, res) => {
    try {
        const { cardId } = req.params;

        const card = await Card.findById(cardId);

        if (!card) {
            return res.status(404).json({
                message: "Card not found",
            });
        }

        const listings = await Listing.find({ cardId, status: "active" })
            .populate("cardId")
            .sort({ createdAt: -1 });

        res.json(listings);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch card listings",
            error: error.message,
        });
    }
});

// GET one card by ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const card = await Card.findById(id);

        if (!card) {
            return res.status(404).json({
                message: "Card not found",
            });
        }

        res.json(card);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch card",
            error: error.message,
        });
    }
});

// GET card summary by ID
router.get("/:id/summary", async (req, res) => {
    try {
        const { id } = req.params;

        const card = await Card.findById(id);

        if (!card) {
            return res.status(404).json({
                message: "Card not found",
            });
        }

        const priceHistory = await PriceHistory.find({ cardId: id })
            .sort({ soldDate: -1 })
            .limit(20);
        
        const soldPrices = priceHistory.map((entry) => entry.price);
        const estimatedMarketValue = median(soldPrices);

        res.json({
            card,
            estimatedMarketValue,
            priceCount: soldPrices.length,
            method: "median",
            priceHistory,
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch card summary",
            error: error.message,
        });
    }
});

export default router;
