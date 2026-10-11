import express from 'express';
import { body, param, query } from 'express-validator';
import mongoose from 'mongoose';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.use(auth);

const validateId = [
  param('id').custom((val) => {
    if (!mongoose.Types.ObjectId.isValid(val)) throw new Error('Invalid budget ID');
    return true;
  }),
];

// ---------------------------------------------------------------------------
// GET /api/budgets?month=&year=   (with actual spending from transactions)
// ---------------------------------------------------------------------------
router.get(
  '/',
  [
    query('month').optional().isInt({ min: 1, max: 12 }).withMessage('Month must be 1-12'),
    query('year').optional().isInt({ min: 2000 }).withMessage('Invalid year'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const now = new Date();
      const month = parseInt(req.query.month) || now.getMonth() + 1;
      const year = parseInt(req.query.year) || now.getFullYear();

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);

      // Fetch budgets and actual spending in parallel
      const [budgets, spendingAgg] = await Promise.all([
        Budget.find({ user: req.user.id, month, year }).sort({ category: 1 }),
        Transaction.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(req.user.id),
              type: 'expense',
              date: { $gte: startDate, $lte: endDate },
            },
          },
          { $group: { _id: '$category', spent: { $sum: '$amount' } } },
        ]),
      ]);

      // Build a lookup map for spending by category
      const spendingMap = {};
      spendingAgg.forEach(({ _id, spent }) => {
        spendingMap[_id.toLowerCase()] = spent;
      });

      const budgetsWithSpending = budgets.map((b) => {
        const spent = spendingMap[b.category.toLowerCase()] || 0;
        return {
          ...b.toJSON(),
          actualSpending: spent,
          remaining: b.limit - spent,
          percentUsed: b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0,
        };
      });

      return res.json({
        success: true,
        data: { budgets: budgetsWithSpending, month, year },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// GET /api/budgets/:id
// ---------------------------------------------------------------------------
router.get('/:id', validateId, validate, async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });
    return res.json({ success: true, data: { budget } });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/budgets
// ---------------------------------------------------------------------------
router.post(
  '/',
  [
    body('month').isInt({ min: 1, max: 12 }).withMessage('Month must be 1-12'),
    body('year').isInt({ min: 2000 }).withMessage('Invalid year'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('limit').isFloat({ min: 0 }).withMessage('Limit must be 0 or more'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { month, year, category, limit } = req.body;
      const budget = await Budget.create({
        user: req.user.id,
        month: parseInt(month),
        year: parseInt(year),
        category: category.trim(),
        limit: parseFloat(limit),
      });
      return res.status(201).json({ success: true, message: 'Budget created', data: { budget } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// PATCH /api/budgets/:id
// ---------------------------------------------------------------------------
router.patch(
  '/:id',
  [...validateId,
    body('limit').optional().isFloat({ min: 0 }).withMessage('Limit must be 0 or more'),
    body('category').optional().trim().notEmpty(),
    body('month').optional().isInt({ min: 1, max: 12 }),
    body('year').optional().isInt({ min: 2000 }),
  ],
  validate,
  async (req, res, next) => {
    try {
      const allowed = ['month', 'year', 'category', 'limit'];
      const updates = {};
      for (const f of allowed) {
        if (req.body[f] !== undefined) updates[f] = req.body[f];
      }

      const budget = await Budget.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $set: updates },
        { new: true, runValidators: true }
      );
      if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });
      return res.json({ success: true, message: 'Budget updated', data: { budget } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// DELETE /api/budgets/:id
// ---------------------------------------------------------------------------
router.delete('/:id', validateId, validate, async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!budget) return res.status(404).json({ success: false, message: 'Budget not found' });
    return res.json({ success: true, message: 'Budget deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
