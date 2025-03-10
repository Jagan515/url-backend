# URL Shortener Backend

Welcome to the backend of my URL Shortener app! This is the "behind-the-scenes" worker that takes long URLs, shrinks them into short ones, saves them in a database, and even makes QR codes for you. It’s built with Node.js and runs smoothly on Vercel at [https://url-backend-tau.vercel.app/](https://url-backend-tau.vercel.app/).

- **Repository**: [github.com/Jagan515/url-backend](https://github.com/Jagan515/url-backend)
- **Live API**: [url-backend-tau.vercel.app/](https://url-backend-tau.vercel.app/)

---

## What It Does
This backend is like a magic shrinking machine. The frontend sends it a long URL (e.g., [https://cloud.mongodb.com/](https://cloud.mongodb.com/)), and it turns it into a short one (e.g., [https://url-backend-tau.vercel.app/we](https://url-backend-tau.vercel.app/we)). It also handles redirecting you to the original URL when you click the short link and stores everything in MongoDB so nothing gets lost!

---

## Features
- Shrinks long URLs into short, random codes (or your custom alias).
- Creates QR codes for every short URL.
- Saves URLs in a database for fast redirects.
- Works with the frontend at [jagan515.github.io/Url-shortner/](https://jagan515.github.io/Url-shortner/).

---

## Project Structure
Here’s what’s inside the repo:
- **`index.js`**: The main worker file—handles shrinking, redirecting, and QR codes.
- **`package.json`**: The toolbox list (tells Node.js what tools we need).
- **`vercel.json`**: Instructions for Vercel on how to run the shop.
- **`.env`** (not in GitHub): Secret key file for the database (you’ll make this).

---

## Setup (For Developers)

### Prerequisites
- [Node.js](https://nodejs.org/) (v20.15.0 or higher) – the engine that runs the app.
- [Git](https://git-scm.com/) – to grab the code.
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) – free cloud database (sign up for an account).
- [Vercel](https://vercel.com/) – free hosting (sign up with GitHub).

### Steps
1. **Clone the Repo**:
   ```bash
   git clone https://github.com/Jagan515/url-backend.git
   cd url-backend
