const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const nanoid = require("nanoid/non-secure"); // Fixed for CommonJS
const QRCode = require("qrcode");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader("Permissions-Policy", "interest-cohort=()");
    next();
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortId: String,
    customAlias: String,
});
const Url = mongoose.model("Url", urlSchema);

app.post("/api/shorten", async (req, res) => {
    const { originalUrl, customAlias } = req.body;
    let shortId = customAlias || nanoid(6); // nanoid() now works

    try {
        if (customAlias) {
            const existing = await Url.findOne({ shortId: customAlias });
            if (existing) {
                return res.status(400).json({ error: "Alias already taken" });
            }
        }

        const url = new Url({ originalUrl, shortId });
        await url.save();

        const shortUrl = `${req.protocol}://${req.get("host")}/${shortId}`;
        const qrCode = await QRCode.toDataURL(shortUrl);
        res.json({ shortUrl, qrCode });
    } catch (err) {
        console.error("❌ Error shortening URL:", err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

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

app.get("/", (req, res) => {
    res.send("URL Shortener API is running...");
});

module.exports = app;
