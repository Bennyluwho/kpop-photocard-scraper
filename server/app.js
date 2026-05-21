import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cardRoutes from "./routes/cards.js";
import priceRoutes from "./routes/prices.js";

dotenv.config();

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

    app.use("/api/cards", cardRoutes);
    app.use("/api/prices", priceRoutes);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`) 
    });