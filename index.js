import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortId: String,
  customAlias: String,
});
const Url = mongoose.model('Url', urlSchema);
app.get("/", (req, res) => {
  res.send("URL Shortener API is running...");
});

app.post('/api/shorten', async (req, res) => {
  const { originalUrl, customAlias } = req.body;
  let shortId = customAlias || nanoid(6);

  if (customAlias) {
    const existing = await Url.findOne({ shortId: customAlias });
    if (existing) return res.status(400).json({ error: 'Alias already taken' });
  }

  const url = new Url({ originalUrl, shortId });
  await url.save();

  const shortUrl = `https://your-vercel-url.vercel.app/${shortId}`; // Update this later
  const qrCode = await QRCode.toDataURL(shortUrl);
  res.json({ shortUrl, qrCode });
});
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


app.get('/:shortId', async (req, res) => {
  const { shortId } = req.params;
  const url = await Url.findOne({ shortId });
  if (url) res.redirect(url.originalUrl);
  else res.status(404).send('Not found');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
