import express from 'express';
import { body, param, query } from 'express-validator';
import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.use(auth);

const validateId = [
  param('id').custom((val) => {
    if (!mongoose.Types.ObjectId.isValid(val)) throw new Error('Invalid transaction ID');
    return true;
  }),
];

// ---------------------------------------------------------------------------
// GET /api/transactions?type=&category=&startDate=&endDate=&page=&limit=
// ---------------------------------------------------------------------------
router.get(
  '/',
  [
    query('type').optional().isIn(['income', 'expense']).withMessage('type must be income or expense'),
    query('page').optional().isInt({ min: 1 }),
    query('limit').optional().isInt({ min: 1, max: 200 }),
    query('startDate').optional().isISO8601().withMessage('Invalid startDate'),
    query('endDate').optional().isISO8601().withMessage('Invalid endDate'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { type, category, startDate, endDate, page = 1, limit = 20 } = req.query;
      const filter = { user: req.user.id };

      if (type) filter.type = type;
      if (category) filter.category = new RegExp(category, 'i');
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [transactions, total] = await Promise.all([
        Transaction.find(filter).sort({ date: -1 }).skip(skip).limit(parseInt(limit)),
        Transaction.countDocuments(filter),
      ]);

      return res.json({
        success: true,
        data: {
          transactions,
          pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// GET /api/transactions/summary?month=&year=
// ---------------------------------------------------------------------------
router.get(
  '/summary',
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

      const [summary, categoryBreakdown] = await Promise.all([
        Transaction.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(req.user.id),
              date: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: '$type',
              total: { $sum: '$amount' },
              count: { $sum: 1 },
            },
          },
        ]),
        Transaction.aggregate([
          {
            $match: {
              user: new mongoose.Types.ObjectId(req.user.id),
              date: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: { type: '$type', category: '$category' },
              total: { $sum: '$amount' },
              count: { $sum: 1 },
            },
          },
          { $sort: { total: -1 } },
        ]),
      ]);

      const income = summary.find((s) => s._id === 'income') || { total: 0, count: 0 };
      const expenses = summary.find((s) => s._id === 'expense') || { total: 0, count: 0 };

      return res.json({
        success: true,
        data: {
          month,
          year,
          income: { total: income.total, count: income.count },
          expenses: { total: expenses.total, count: expenses.count },
          netBalance: income.total - expenses.total,
          categoryBreakdown: categoryBreakdown.map((c) => ({
            type: c._id.type,
            category: c._id.category,
            total: c.total,
            count: c.count,
          })),
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// GET /api/transactions/:id
// ---------------------------------------------------------------------------
router.get('/:id', validateId, validate, async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({ _id: req.params.id, user: req.user.id });
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    return res.json({ success: true, data: { transaction } });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/transactions
// ---------------------------------------------------------------------------
router.post(
  '/',
  [
    body('type').isIn(['income', 'expense']).withMessage('Type must be income or expense'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be at least 0.01'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('date').optional().isISO8601().withMessage('Invalid date'),
    body('description').optional().trim(),
    body('paymentMethod').optional().trim(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { type, amount, category, description, date, paymentMethod } = req.body;
      const transaction = await Transaction.create({
        user: req.user.id,
        type,
        amount,
        category,
        description,
        date: date || new Date(),
        paymentMethod,
      });
      return res.status(201).json({ success: true, message: 'Transaction created', data: { transaction } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// PATCH /api/transactions/:id
// ---------------------------------------------------------------------------
router.patch(
  '/:id',
  [...validateId,
    body('type').optional().isIn(['income', 'expense']),
    body('amount').optional().isFloat({ min: 0.01 }).withMessage('Amount must be at least 0.01'),
    body('category').optional().trim().notEmpty(),
    body('date').optional().isISO8601().withMessage('Invalid date'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const allowed = ['type', 'amount', 'category', 'description', 'date', 'paymentMethod'];
      const updates = {};
      for (const f of allowed) {
        if (req.body[f] !== undefined) updates[f] = req.body[f];
      }

      const transaction = await Transaction.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $set: updates },
        { new: true, runValidators: true }
      );
      if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
      return res.json({ success: true, message: 'Transaction updated', data: { transaction } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// DELETE /api/transactions/:id
// ---------------------------------------------------------------------------
router.delete('/:id', validateId, validate, async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!transaction) return res.status(404).json({ success: false, message: 'Transaction not found' });
    return res.json({ success: true, message: 'Transaction deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
