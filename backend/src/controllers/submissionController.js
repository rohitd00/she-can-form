// submissionController.js
// Handles public form submissions and admin-facing submission management.

const { validationResult } = require('express-validator');
const prisma = require('../config/db');

// POST /api/submit
// Public endpoint — anyone can submit the contact form
async function submitForm(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Please fix the errors below.',
      errors: errors.array()
    });
  }

  const { name, email, message } = req.body;

  // Grab IP for basic spam tracking — not shown to admins by default
  const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

  try {
    const submission = await prisma.submission.create({
      data: { name, email, message, ipAddress }
    });

    return res.status(201).json({
      message: 'Form Submitted Successfully',
      id: submission.id
    });
  } catch (err) {
    console.error('Error saving submission:', err);
    return res.status(500).json({ message: 'Something went wrong. Please try again.' });
  }
}

// GET /api/admin/submissions
// Admin only — returns all submissions, newest first
async function getAllSubmissions(req, res) {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        isRead: true,
        createdAt: true
      }
    });

    return res.status(200).json({ submissions });
  } catch (err) {
    console.error('Error fetching submissions:', err);
    return res.status(500).json({ message: 'Failed to fetch submissions.' });
  }
}

// PATCH /api/admin/submissions/:id/read
// Admin only — marks a submission as read
async function markAsRead(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid submission ID.' });
  }

  try {
    const updated = await prisma.submission.update({
      where: { id },
      data: { isRead: true },
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        isRead: true,
        createdAt: true
      }
    });

    return res.status(200).json({ message: 'Marked as read.', submission: updated });
  } catch (err) {
    // Prisma throws a specific error if the record doesn't exist
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Submission not found.' });
    }
    console.error('Error marking submission as read:', err);
    return res.status(500).json({ message: 'Failed to update submission.' });
  }
}

// DELETE /api/admin/submissions/:id
// Admin only — deletes a submission permanently
async function deleteSubmission(req, res) {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid submission ID.' });
  }

  try {
    await prisma.submission.delete({ where: { id } });
    return res.status(200).json({ message: 'Submission deleted.' });
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Submission not found.' });
    }
    console.error('Error deleting submission:', err);
    return res.status(500).json({ message: 'Failed to delete submission.' });
  }
}

module.exports = { submitForm, getAllSubmissions, markAsRead, deleteSubmission };
