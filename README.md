# She Can Foundation — Contact Form System

A full stack web application built for the She Can Foundation internship selection task. It includes a public contact form, a Node.js/Express REST API, a **SQLite** database via Prisma ORM, JWT-based admin authentication, and a dashboard for managing submissions.

---

## Features

**Public facing:**
- Contact form with name, email, and message fields
- Client-side and server-side validation
- Rate limiting (5 submissions per IP per 15 minutes)
- "Form Submitted Successfully" feedback on submit

**Admin panel:**
- JWT-based login (credentials stored securely with bcrypt)
- View all submissions in a table
- Mark submissions as read
- Delete submissions
- Stats bar showing total and unread count

**Backend:**
- Express.js REST API
- Prisma ORM + SQLite (zero-config, file-based database)
- Input sanitization and validation via express-validator
- Rate limiting on public and login routes
- Proper error handling and HTTP status codes

---

## Project Structure

```
shecan-fullstack/
├── README.md                 # Quick-start guide (this file's sibling)
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── seed.js           # Creates admin account (reads from .env)
│   │   └── shecan.db         # SQLite database file (auto-created, git-ignored)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js         # Prisma client singleton
│   │   ├── controllers/
│   │   │   ├── authController.js        # Login logic
│   │   │   └── submissionController.js  # CRUD for submissions
│   │   ├── middleware/
│   │   │   └── authMiddleware.js        # JWT verification
│   │   ├── routes/
│   │   │   ├── authRoutes.js            # POST /api/admin/login
│   │   │   └── submissionRoutes.js      # Form submit + admin endpoints
│   │   └── index.js          # Express app entry point
│   ├── .env.example          # Environment variable template
│   └── package.json
└── frontend/
    └── index.html            # Single-page UI (form + admin panel)
```

---

## Setup & Installation

### Prerequisites

- Node.js v18 or later
- npm

> **No database server required.** SQLite stores everything in a local file (`prisma/shecan.db`) that is created automatically on first migration.

### 1. Clone the project

```bash
git clone <your-repo-url>
cd shecan-fullstack/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in:
- `JWT_SECRET` — any long random string (use a password generator)
- `CLIENT_ORIGIN` — the URL where you'll open `index.html` (e.g. `http://localhost:3000` or `file://`)

> `DATABASE_URL` is already set to `file:./shecan.db` in `.env.example` — no changes needed for local development.

### 4. Run database migrations

```bash
npx prisma migrate dev --name init
```

This creates `prisma/shecan.db` with the `submissions` and `admins` tables automatically.

### 5. Seed the database

First, set your admin credentials in `.env`:

```env
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="your_strong_password_here"
```

Then run:

```bash
npm run seed
```

This creates the admin account with the credentials you set above.

> **Never use predictable passwords.** The seed script will refuse to run if `ADMIN_PASSWORD` is not set in `.env`.

### 6. Start the server

```bash
# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

Server runs at `http://localhost:5000`.

### 7. Open the frontend

Just open `frontend/index.html` in your browser. No build step needed.

> If you get CORS errors, make sure `CLIENT_ORIGIN` in `.env` matches the URL shown in your browser's address bar.

---

## API Reference

### Public

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/submit` | Submit the contact form |
| GET | `/health` | Server health check |

#### POST /api/submit

Request body:
```json
{
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "message": "Hello, I wanted to reach out..."
}
```

Success (201):
```json
{
  "message": "Form Submitted Successfully",
  "id": 7
}
```

Validation error (400):
```json
{
  "message": "Please fix the errors below.",
  "errors": [
    { "path": "email", "msg": "Please enter a valid email address." }
  ]
}
```

### Admin (requires JWT in `Authorization: Bearer <token>` header)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Get JWT token |
| GET | `/api/admin/submissions` | List all submissions |
| PATCH | `/api/admin/submissions/:id/read` | Mark submission as read |
| DELETE | `/api/admin/submissions/:id` | Delete a submission |

#### POST /api/admin/login

```json
{ "username": "admin", "password": "admin@shecan123" }
```

Response (200):
```json
{
  "message": "Login successful.",
  "token": "eyJhbGci...",
  "admin": { "id": 1, "username": "admin" }
}
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JS |
| Backend | Node.js, Express.js |
| Database | SQLite (file-based, zero config) |
| ORM | Prisma |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Validation | express-validator |
| Rate Limiting | express-rate-limit |
| Logging | morgan |

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite file path (relative to prisma/) | `file:./shecan.db` |
| `JWT_SECRET` | Secret key for signing JWTs | `some_very_long_random_string` |
| `JWT_EXPIRES_IN` | Token lifespan | `12h` |
| `PORT` | Server port | `5000` |
| `CLIENT_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |

---

## Notes

- The frontend is a single HTML file with no framework dependencies or build tools. This keeps it lightweight and easy to deploy or share.
- Passwords are hashed with bcryptjs (10 rounds) before being stored.
- User-supplied content is escaped before rendering in the admin table to prevent XSS.
- The `isRead` flag is stored per submission to track which messages the admin has reviewed.
- The SQLite database file (`prisma/shecan.db`) is excluded from version control via `.gitignore`.
