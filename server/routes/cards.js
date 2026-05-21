import express from "express";
import Card from "../models/Card.js";

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

export default router;