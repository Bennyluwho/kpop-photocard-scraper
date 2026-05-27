import express from "express";
import Card from "../models/Card.js";
import PriceHistory from "../models/PriceHistory.js";
import { median, priceTrend } from "../utils/pricing.js";

const router = express.Router();

function buildSearchQuery(search) {
    if (!search) return {};

    return {
        $or: [
            { group: { $regex: search, $options: "i" } },
            { idol: { $regex: search, $options: "i" } },
            { album: { $regex: search, $options: "i" } },
            { version: { $regex: search, $options: "i" } },
            { aliases: { $regex: search, $options: "i" } },
        ],
    };
}

async function enrichCardsWithPricing(cards) {
    const cardIds = cards.map((card) => card._id);

    const histories = await PriceHistory.find({ cardId: { $in: cardIds } })
        .sort({ soldDate: -1 })
        .lean();

    const historyByCard = new Map();

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

        return {
            ...card.toObject(),
            estimatedMarketValue,
            lowestAsk: estimatedMarketValue,
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

        const cards = await Card.find(query).sort({
            group: 1,
            idol: 1,
            album: 1,
        });

        res.json(cards);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch cards",
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