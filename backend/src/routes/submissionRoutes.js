// submissionRoutes.js
// Public route for form submission + protected admin routes

const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/authMiddleware');
const {
  submitForm,
  getAllSubmissions,
  markAsRead,
  deleteSubmission
} = require('../controllers/submissionController');

const router = express.Router();

// Rate limit the public submit endpoint to prevent spam
// Allows 5 submissions per IP every 15 minutes
const submitLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { message: 'Too many submissions from your IP. Please wait a while and try again.' }
});

// Validation rules for the contact form
const submitValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),

  body('message')
    .trim()
    .notEmpty().withMessage('Message is required.')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters.')
];

// Public
router.post('/submit', submitLimiter, submitValidation, submitForm);

// Admin only
router.get('/admin/submissions', protect, getAllSubmissions);
router.patch('/admin/submissions/:id/read', protect, markAsRead);
router.delete('/admin/submissions/:id', protect, deleteSubmission);

module.exports = router;
