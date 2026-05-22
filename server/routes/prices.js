import express from "express";
import PriceHistory from "../models/PriceHistory.js";

const router = express.Router();

// GET estimated market value for one card
router.get("/:cardId/market-value", async (req, res) => {
    try {
        const { cardId } = req.params;

        const prices = await PriceHistory.find({ cardId })
            .sort({ soldDate: -1 })
            .limit(20);

        if (prices.length === 0) {
            return res.json({
                cardId,
                estimatedMarketValue: null,
                priceCount: 0,
                method: "median",
            });
        }

        const soldPrices = prices
            .map((entry) => entry.price)
            .sort((a, b) => a - b);

        const middleIndex = Math.floor(soldPrices.length / 2);

        const median = 
            soldPrices.length % 2 === 0
            ? (soldPrices[middleIndex - 1] + soldPrices[middleIndex]) / 2
            : soldPrices[middleIndex];
        res.json({
            cardId,
            estimatedMarketValue: median,
            priceCount: soldPrices.length,
            method: "median",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to calculate market value",
            error: error.message,
        });
    }
});

// GET price history for one card
router.get("/:cardId", async (req, res) => {
    try {
        const { cardId } = req.params;

        const prices = await PriceHistory.find({ cardId }).sort({
            soldDate: -1,
        });

        res.json(prices);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch price history",
            error: error.message,
        });
    }
});

// POST manual price entry
router.post("/", async (req, res) => {
    try {
        const { cardId, price, source, condition, soldDate, confidence } = req.body;

        const priceEntry = await PriceHistory.create({
            cardId,
            price,
            source,
            condition,
            soldDate,
            confidence,
        });

        res.status(201).json(priceEntry);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create price entry",
            error: error.message,
        });
    }
});

export default router;