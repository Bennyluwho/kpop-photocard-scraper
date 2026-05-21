import mongoose from "mongoose"

const CardSchema = new mongoose.Schema(
    {
    group: {
        type: String,
        required: true
    },

    idol: {
        type: String,
        required: true
    },

    album: {
        type: String,
        required: true
    },

    version: {
        type: String,
        default: ""
    },

    cardType: {
        type:String,
        default: "Photocard"
    },

    rarity: {
        type: String,
        default: "Standard"
    },

    imageUrl: {
        type: String,
        default: ""
    },

    aliases: {
        type: [String],
        default: []
    }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Card",
    CardSchema
);