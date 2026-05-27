// index.js — main entry point for the She Can Foundation backend

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const submissionRoutes = require('./routes/submissionRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Build the allowed origins list.
// Includes the configured CLIENT_ORIGIN plus 'null' to support
// opening frontend/index.html directly from the filesystem (file:// origin).
const allowedOrigins = [
  process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  'null' // browsers send the string "null" for file:// origins
];

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman, mobile apps)
    // or origins in our allowedOrigins list.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: Origin "${origin}" is not allowed.`));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api', submissionRoutes);
app.use('/api', authRoutes);

// Health check — useful for deployment platforms to ping
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// Global error handler — must have 4 params for Express to treat it as error middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  // Guard against sending a response after headers have already been sent
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ message: 'An unexpected error occurred.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
