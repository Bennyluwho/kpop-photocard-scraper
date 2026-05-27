import mongoose from "mongoose";
import dotenv from "dotenv";
import Card from "./models/Card.js";
import PriceHistory from "./models/PriceHistory.js";

dotenv.config();

const salesByIdol = {
    Jungkook: [
        { price: 42, soldDate: new Date("2026-04-10") },
        { price: 45, soldDate: new Date("2026-04-22") },
        { price: 48, soldDate: new Date("2026-05-05") },
        { price: 52, soldDate: new Date("2026-05-18") },
    ],
    Jimin: [
        { price: 28, soldDate: new Date("2026-04-12") },
        { price: 30, soldDate: new Date("2026-05-01") },
        { price: 27, soldDate: new Date("2026-05-20") },
    ],
    V: [
        { price: 35, soldDate: new Date("2026-04-15") },
        { price: 38, soldDate: new Date("2026-05-10") },
        { price: 41, soldDate: new Date("2026-05-22") },
    ],
    RM: [
        { price: 22, soldDate: new Date("2026-04-18") },
        { price: 24, soldDate: new Date("2026-05-12") },
        { price: 23, soldDate: new Date("2026-05-24") },
    ],
};

async function seedPrices() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const cards = await Card.find({ group: "BTS" }).sort({ idol: 1, album: 1 });

        if (!cards.length) {
            console.error("No BTS cards found. Run npm run seed first.");
            process.exit(1);
        }

        await PriceHistory.deleteMany({});

        const entries = [];

        for (const card of cards) {
            const sales =
                salesByIdol[card.idol] ??
                [
                    { price: 25, soldDate: new Date("2026-05-01") },
                    { price: 27, soldDate: new Date("2026-05-15") },
                ];

            for (const sale of sales) {
                entries.push({
                    cardId: card._id,
                    price: sale.price,
                    source: "manual",
                    condition: "Near Mint",
                    soldDate: sale.soldDate,
                    confidence: 0.9,
                });
            }
        }

        await PriceHistory.insertMany(entries);

        console.log(`Seeded ${entries.length} price entries for ${cards.length} cards`);
        process.exit(0);
    } catch (error) {
        console.error("Failed to seed prices:", error.message);
        process.exit(1);
    }
}

seedPrices();
