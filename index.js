const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const QRCode = require("qrcode");
const { v4: uuidv4 } = require("uuid"); // ✅ Replaced nanoid with uuid

dotenv.config();
const app = express();

// ✅ Fix: Allow frontend access via CORS
app.use(cors({ origin: "https://jagan515.github.io" }));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Permissions-Policy", "interest-cohort=()");
    next();
});

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ URL Schema
const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortId: String,
    customAlias: String,
});
const Url = mongoose.model("Url", urlSchema);

// ✅ Shorten URL Route
app.post("/api/shorten", async (req, res) => {
    const { originalUrl, customAlias } = req.body;
    let shortId = customAlias || uuidv4().slice(0, 6); // ✅ Using uuid and slicing to match nanoid length

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
        const qrCode = await QRCode.toDataURL(shortUrl); // ✅ QR Code generation

        res.json({ shortUrl, qrCode });
    } catch (err) {
        console.error("❌ Error shortening URL:", err);
        res.status(500).json({ error: "Something went wrong!" });
    }
});

// ✅ Redirect Route
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

// ✅ API Health Check
app.get("/", (req, res) => {
    res.send("URL Shortener API is running...");
});

module.exports = app;
