import mongoose from "mongoose";

const PriceHistorySchema = new mongoose.Schema(
    {
        cardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Card",
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        source: {
            type: String,
            default: "manual",
        },

        condition: {
            type: String,
            default: "Near Mint",
        },

        soldDate: {
            type: Date,
            required: true,
        },

        confidence: {
            type: Number,
            default: 1,
            min: 0,
            max: 1,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("PriceHistory", PriceHistorySchema);