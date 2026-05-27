# K-Card Market

A K-pop photocard marketplace with price tracking. The React homepage reads live card and pricing data from a Node/Express API backed by MongoDB.

## Project structure

```
├── client/          # Vite + React homepage
└── server/          # Express API, Mongoose models, seed scripts
```

## Prerequisites

- Node.js 20+
- MongoDB running locally (or a MongoDB Atlas connection string)

## Setup

### 1. API server

```bash
cd server
cp .env.example .env
# Edit .env and set MONGO_URI
npm install
npm run seed          # optional: seed BTS test cards
npm run seed:prices   # optional: seed price history (run after seed)
npm run dev
```

The API listens on **http://localhost:5000**.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The dev server proxies `/api` to the backend. Open the URL Vite prints (usually **http://localhost:5173**).

## API overview

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/cards` | List cards (optional `?search=`) |
| GET | `/api/cards/feed` | Cards with estimated value, last sale, trend |
| GET | `/api/cards/groups` | Group names and card counts |
| GET | `/api/cards/:id` | Single card |
| GET | `/api/cards/:id/summary` | Card + price history summary |
| GET | `/api/prices/:cardId` | Price history for a card |
| GET | `/api/prices/:cardId/market-value` | Median market value |
| POST | `/api/prices` | Add a manual price entry |

## Root scripts

From the repo root (after `npm install` in both `client/` and `server/`):

```bash
npm run dev:server
npm run dev:client
npm run seed
npm run seed:prices
```

## Environment variables

| Variable | Location | Description |
|----------|----------|-------------|
| `MONGO_URI` | `server/.env` | MongoDB connection string |
| `PORT` | `server/.env` | API port (default `5000`) |

Never commit `.env` files. Use `server/.env.example` as a template.
