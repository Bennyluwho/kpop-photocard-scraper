import express from "express";
import PriceHistory from "../models/PriceHistory.js";

const router = express.Router();

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