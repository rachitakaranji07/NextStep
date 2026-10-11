import express from 'express';
import { body } from 'express-validator';
import ContactMessage from '../models/ContactMessage.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// ---------------------------------------------------------------------------
// POST /api/contact  (public — no auth required)
// ---------------------------------------------------------------------------
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 200 }),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 5000 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, email, subject, message } = req.body;
      const contact = await ContactMessage.create({ name, email, subject, message });
      return res.status(201).json({
        success: true,
        message: 'Your message has been received. We will get back to you soon.',
        data: { id: contact._id },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
