// authRoutes.js

const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { login } = require('../controllers/authController');

const router = express.Router();

// Strict rate limit on login — 10 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please try again later.' }
});

const loginValidation = [
  body('username').trim().notEmpty(),
  body('password').notEmpty()
];

router.post('/admin/login', loginLimiter, loginValidation, login);

module.exports = router;
