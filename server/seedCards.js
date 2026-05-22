import mongoose from "mongoose";
import dotenv from "dotenv";
import Card from "./models/Card.js";

dotenv.config();

const cards = [
  {
    group: "BTS",
    idol: "Jungkook",
    album: "Map of the Soul: 7",
    version: "Version 2",
    cardType: "Album photocard",
    rarity: "Standard",
    imageUrl: "",
    aliases: [
      "JK MOTS7 Ver 2",
      "Jungkook MOTS7",
      "BTS Jungkook Map of the Soul 7",
    ],
  },
  {
    group: "BTS",
    idol: "Jungkook",
    album: "BE",
    version: "Essential Edition",
    cardType: "Album photocard",
    rarity: "Standard",
    imageUrl: "",
    aliases: [
      "JK BE Essential",
      "Jungkook BE PC",
      "BTS BE Jungkook",
    ],
  },
  {
    group: "BTS",
    idol: "Jimin",
    album: "Proof",
    version: "Standard Edition",
    cardType: "Album photocard",
    rarity: "Standard",
    imageUrl: "",
    aliases: [
      "Jimin Proof PC",
      "BTS Proof Jimin",
      "Park Jimin Proof",
    ],
  },
  {
    group: "BTS",
    idol: "V",
    album: "Love Yourself: Tear",
    version: "Y Version",
    cardType: "Album photocard",
    rarity: "Standard",
    imageUrl: "",
    aliases: [
      "Taehyung Tear Y",
      "V Love Yourself Tear",
      "BTS Tae Tear PC",
    ],
  },
  {
    group: "BTS",
    idol: "RM",
    album: "Love Yourself: Answer",
    version: "S Version",
    cardType: "Album photocard",
    rarity: "Standard",
    imageUrl: "",
    aliases: [
      "Namjoon Answer S",
      "RM Love Yourself Answer",
      "BTS RM Answer PC",
    ],
  },
];

async function seedCards() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        await Card.deleteMany({ group: "BTS" });

        await Card.insertMany(cards);

        console.log("Seeded cards successfully")
        process.exit(1);
    } catch (error) {
        console.error("Failed to seed cards:", error.message);
        process.exit(1);
    }
}

seedCards();