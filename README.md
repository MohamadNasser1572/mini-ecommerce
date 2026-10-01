# Mini E-Commerce

A small online shop. You can log in, browse 15 products, pick a variant (size, color, storage...), add items to your cart or wishlist, and place an order.

It works on phones, tablets and desktops.

## What's inside

| Folder      | What it is                                                |
| ----------- | --------------------------------------------------------- |
| `backend/`  | The API (Node.js, Express, TypeScript, Prisma, SQLite)    |
| `frontend/` | The website (React, Vite, TypeScript, Tailwind CSS)       |

## Do I need to install a database?

**No.** The project uses **SQLite**, which stores the whole database in one file (`backend/prisma/dev.db`).
You don't install or start any database server. The setup command below creates that file and fills it with sample products for you.

## What you need

- [Node.js](https://nodejs.org) **version 22 or newer** (check with `node -v`)
- Git

## How to run it

You will use **two terminals**: one for the backend, one for the frontend.

### 1. Download the project

```bash
git clone https://github.com/MohamadNasser1572/mini-ecommerce.git
cd mini-ecommerce
```

### 2. Start the backend (terminal 1)

```bash
cd backend
npm install
```

Create the settings file by copying the example:

```bash
# Mac / Linux / Git Bash
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

Create the database and add the sample data, then start the server:

```bash
npm run setup
npm run dev
```

You should see: `API running on http://localhost:4000`

### 3. Start the frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

### 4. Open the shop

Go to **http://localhost:5173** and log in with:

- **Email:** `demo@shop.com`
- **Password:** `password123`

## Useful commands

Run these inside the `backend` folder.

| Command          | What it does                                       |
| ---------------- | -------------------------------------------------- |
| `npm run dev`    | Starts the API                                     |
| `npm run setup`  | Creates the database and adds the sample data      |
| `npm run db:seed`| Resets the products, stock and demo user           |

## Something went wrong?

- **"Missing environment variable: JWT_SECRET"**: you skipped the copy step. Create the `.env` file (step 2).
- **"Cannot reach the server"** on the website: the backend is not running. Start it in terminal 1.
- **Port already in use**: another app is using port 4000 or 5173. Close it, or change `PORT` in `backend/.env`.
- **Want a fresh start?** Run `npm run db:seed` in the `backend` folder.
