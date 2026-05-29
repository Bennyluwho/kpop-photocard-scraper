import mongoose from "mongoose";

const ListingSchema = new mongoose.Schema(
    {
        cardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Card",
            required: true,
        },
        sellerName: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        condition: {
            type: String,
            required: true,
            trim: true,
        },
        userImageUrl: {
            type: String,
            default: "",
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        status: {
            type: String,
            enum: ["active", "sold", "inactive"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Listing", ListingSchema);
