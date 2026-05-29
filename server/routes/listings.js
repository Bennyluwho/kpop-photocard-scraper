import express from "express";
import Card from "../models/Card.js";
import Listing from "../models/Listing.js";

const router = express.Router();

// GET active listings, newest first
router.get("/", async (req, res) => {
    try {
        const listings = await Listing.find({ status: "active" })
            .populate("cardId")
            .sort({ createdAt: -1 });

        res.json(listings);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch listings",
            error: error.message,
        });
    }
});

// POST create a seller listing for an official catalog card
router.post("/", async (req, res) => {
    try {
        const {
            cardId,
            sellerName,
            price,
            condition,
            userImageUrl = "",
            description = "",
        } = req.body;

        const trimmedSellerName = String(sellerName ?? "").trim();
        const trimmedCondition = String(condition ?? "").trim();

        if (!cardId || !trimmedSellerName || price === undefined || price === null || price === "" || !trimmedCondition) {
            return res.status(400).json({
                message: "Card, seller name, price, and condition are required",
            });
        }

        const parsedPrice = Number(price);

        if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
            return res.status(400).json({
                message: "Price must be a non-negative number",
            });
        }

        const card = await Card.findById(cardId);

        if (!card) {
            return res.status(404).json({
                message: "Card not found",
            });
        }

        const listing = await Listing.create({
            cardId,
            sellerName: trimmedSellerName,
            price: parsedPrice,
            condition: trimmedCondition,
            userImageUrl: String(userImageUrl ?? "").trim(),
            description: String(description ?? "").trim(),
            status: "active",
        });

        const populatedListing = await Listing.findById(listing._id).populate("cardId");

        res.status(201).json(populatedListing);
    } catch (error) {
        res.status(400).json({
            message: "Failed to create listing",
            error: error.message,
        });
    }
});

export default router;
