
---

### `README.md` for `url-backend` (Backend)

```markdown
# URL Shortener Backend

This is the behind-the-scenes part of my URL shortener app! It takes long URLs, shrinks them, saves them in a database, and makes QR codes. It runs on Vercel at [https://url-backend-tau.vercel.app/](https://url-backend-tau.vercel.app/).

- **Repo**: [github.com/Jagan515/url-backend](https://github.com/Jagan515/url-backend)
- **Live API**: [url-backend-tau.vercel.app/](https://url-backend-tau.vercel.app/)

---

## What It Does
The frontend sends a long URL here (e.g., [https://cloud.mongodb.com/](https://cloud.mongodb.com/)), and this backend turns it into a short one (e.g., [https://url-backend-tau.vercel.app/we](https://url-backend-tau.vercel.app/we)). It also handles redirecting when you click the short link!

---

## Features
- Shrinks URLs into short codes.
- Supports custom aliases.
- Stores URLs in MongoDB.
- Creates QR codes for short links.

---

## Setup (For Developers)

### Prerequisites
- [Node.js](https://nodejs.org) (v20.15.0 or higher).
- [Git](https://git-scm.com).
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account.
- [Vercel](https://vercel.com) account.

### Steps
1. **Clone the Repo**:
   ```bash
   git clone https://github.com/Jagan515/url-backend.git
   cd url-backend
