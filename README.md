# Mini E-Commerce

A small online shop. You can log in, browse 15 products, pick a variant (size, color, storage...), add items to your cart or wishlist, and place an order.

It works on phones, tablets and desktops.

## What's inside

| Folder      | What it is                                                  |
| ----------- | ----------------------------------------------------------- |
| `backend/`  | The API (Node.js, Express, TypeScript, Prisma, PostgreSQL)  |
| `frontend/` | The website (React, Vite, TypeScript, Tailwind CSS)         |

## What you need

- [Node.js](https://nodejs.org) **version 22 or newer** (check with `node -v`)
- Git
- A **PostgreSQL** database. Pick one of these:
  - **Option A (easiest):** [Docker Desktop](https://www.docker.com/products/docker-desktop/). The project starts PostgreSQL for you.
  - **Option B:** PostgreSQL installed on your computer ([download](https://www.postgresql.org/download/)).

## How to run it

You will use **two terminals**: one for the backend, one for the frontend.

### 1. Download the project

```bash
git clone https://github.com/MohamadNasser1572/mini-ecommerce.git
cd mini-ecommerce
```

### 2. Start the database

**Option A: with Docker.** Open Docker Desktop, then run this in the project folder:

```bash
docker compose up -d
```

This starts PostgreSQL with the user `shop`, password `shop` and a database called `mini_ecommerce`. Nothing else to do.

**Option B: your own PostgreSQL.** Create an empty database called `mini_ecommerce` (for example in pgAdmin). In step 3 you will put your own username and password in the `.env` file.

### 3. Start the backend (terminal 1)

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

If you use **Option B**, open `backend/.env` and change the first line to your own login:

```
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/mini_ecommerce?schema=public"
```

Create the tables and add the sample data, then start the server:

```bash
npm run setup
npm run dev
```

You should see: `API running on http://localhost:4000`

### 4. Start the frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

### 5. Open the shop

Go to **http://localhost:5173** and log in with:

- **Email:** `demo@shop.com`
- **Password:** `password123`

## Useful commands

Run these inside the `backend` folder.

| Command           | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Starts the API                                   |
| `npm run setup`   | Creates the tables and adds the sample data      |
| `npm run db:seed` | Resets the products, stock and demo user         |

To stop the Docker database: `docker compose down` (your data is kept).

## Something went wrong?

- **"Can't reach database server at localhost:5432"**: PostgreSQL is not running. Start Docker Desktop and run `docker compose up -d`, or start your own PostgreSQL.
- **"Authentication failed against database server"**: the username or password in `backend/.env` is wrong.
- **Port 5432 already in use** when running Docker: PostgreSQL is already installed on your computer. Use Option B instead.
- **"Missing environment variable: JWT_SECRET"**: you skipped the copy step. Create the `.env` file (step 3).
- **"Cannot reach the server"** on the website: the backend is not running. Start it in terminal 1.
- **Want a fresh start?** Run `npm run db:seed` in the `backend` folder.

## Credits

Product photos are from [Unsplash](https://unsplash.com) and are free to use under the Unsplash License.
