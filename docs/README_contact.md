# She Can Foundation — Contact Form System

A full-stack web application for the She Can Foundation internship selection task.

- **Frontend:** Single-page HTML/CSS/JS (no build step needed)
- **Backend:** Node.js + Express REST API
- **Database:** SQLite via Prisma ORM
- **Auth:** JWT + bcrypt

## Quick Start

```bash
cd backend
npm install
cp .env.example .env    # Fill in JWT_SECRET and ADMIN_PASSWORD
npx prisma migrate dev --name init
npm run seed
npm run dev             # API runs at http://localhost:5000
```

Then open `frontend/index.html` in your browser.

## Full Documentation

See [`docs/README.md`](./docs/README.md) for complete setup instructions, API reference, environment variables, and architecture notes.
