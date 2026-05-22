import express from "express";
import Card from "../models/Card.js";
import PriceHistory from "../models/PriceHistory.js";

const router = express.Router();

// GET all cards
router.get("/", async (req, res) => {
    try {
        const { search } = req.query;

        const query = search
            ? {
                $or: [
                    { group: { $regex: search, $options: "i"} },
                    { idol: { $regex: search, $options: "i"} },
                    { album: { $regex: search, $options: "i"} },
                    { version: { $regex: search, $options: "i"} },
                    { aliases: { $regex: search, $options: "i"} },
                ]
            }
        : {};

        const cards = await Card.find(query).sort({
            group: 1,
            idol: 1,
            album: 1
        });

        res.json(cards);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch cards",
            error: error.message
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
        
        const soldPrices = priceHistory
            .map((entry) => entry.price)
            .sort((a, b) => a - b);
        
        let estimatedMarketValue = null;

        if (soldPrices.length > 0) {
            const middleIndex = Math.floor(soldPrices.length / 2);

            estimatedMarketValue =
                soldPrices.length % 2 === 0
                ? (soldPrices[middleIndex - 1] + soldPrices[middleIndex]) / 2
                : soldPrices[middleIndex];
        }

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