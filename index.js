import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// URL Schema
const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortId: { type: String, unique: true, required: true },
  customAlias: { type: String, unique: true, sparse: true },
});
const Url = mongoose.model("Url", urlSchema);

// API to create a short URL
app.post("/api/shorten", async (req, res) => {
  try {
    const { originalUrl, customAlias } = req.body;

    // Check if custom alias already exists
    if (customAlias) {
      const existingAlias = await Url.findOne({ shortId: customAlias });
      if (existingAlias) return res.status(400).json({ error: "Alias already taken" });
    }

    // Generate a short ID
    const shortId = customAlias || nanoid(6);

    // Save to database
    const newUrl = new Url({ originalUrl, shortId });
    await newUrl.save();

    // Generate QR code
    const shortUrl = `http://localhost:5000/${shortId}`;
    const qrCode = await QRCode.toDataURL(shortUrl);

    res.json({ shortUrl, qrCode });
  } catch (error) {
    console.error("❌ Error creating short URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Redirect short URL to original
app.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;
    const url = await Url.findOne({ shortId });

    if (url) return res.redirect(url.originalUrl);
    res.status(404).send("❌ URL not found");
  } catch (error) {
    console.error("❌ Error in redirection:", error);
    res.status(500).send("Internal server error");
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
