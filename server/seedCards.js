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
    imageUrl: "https://i.pinimg.com/736x/c3/36/50/c3365081a1ad4280c209c7b3bbd3822e.jpg",
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
    imageUrl: "https://i.pinimg.com/564x/c9/ea/a7/c9eaa7711fedf0d84235abb6d83a6033.jpg",
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
    imageUrl: "https://i.pinimg.com/736x/af/f8/97/aff897c3955e0681833a1e58f9178b32.jpg",
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
    imageUrl: "https://i.pinimg.com/736x/12/6c/c6/126cc6458abb97b598f9585c82ac5d22.jpg",
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
    imageUrl: "https://i.pinimg.com/736x/c1/73/74/c173748dd9eb80b1831d4fb2ef40b7c8.jpg",
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

        console.log("Seeded cards successfully");
        process.exit(0);
    } catch (error) {
        console.error("Failed to seed cards:", error.message);
        process.exit(1);
    }
}

seedCards();