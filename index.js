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
    originalUrl: String,
    shortId: String,
    customAlias: String,
});
const Url = mongoose.model("Url", urlSchema);

// API to create a short URL
app.post("/api/shorten", async (req, res) => {
    const { originalUrl, customAlias } = req.body;

    try {
        if (customAlias) {
            const existing = await Url.findOne({ shortId: customAlias });
            if (existing) {
                return res.status(400).json({ error: "Alias already taken" });
            }
        }

        const url = new Url({ originalUrl, shortId });
        await url.save();

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
    const { shortId } = req.params;
    try {
        const url = await Url.findOne({ shortId });
        if (url) {
            res.redirect(url.originalUrl);
        } else {
            res.status(404).send("Not found");
        }
    } catch (err) {
        console.error("❌ Error redirecting:", err);
        res.status(500).send("Server error");
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
