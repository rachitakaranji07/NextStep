import express from 'express';
import { body, param } from 'express-validator';
import mongoose from 'mongoose';
import SavingsGoal from '../models/SavingsGoal.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.use(auth);

const validateId = [
  param('id').custom((val) => {
    if (!mongoose.Types.ObjectId.isValid(val)) throw new Error('Invalid savings goal ID');
    return true;
  }),
];

// ---------------------------------------------------------------------------
// GET /api/savings-goals
// ---------------------------------------------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user.id };
    if (status) filter.status = status;

    const goals = await SavingsGoal.find(filter).sort({ updatedAt: -1 });
    return res.json({ success: true, data: { goals } });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/savings-goals/:id
// ---------------------------------------------------------------------------
router.get('/:id', validateId, validate, async (req, res, next) => {
  try {
    const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) return res.status(404).json({ success: false, message: 'Savings goal not found' });
    return res.json({ success: true, data: { goal } });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/savings-goals
// ---------------------------------------------------------------------------
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Goal name is required').isLength({ max: 200 }),
    body('targetAmount').isFloat({ min: 0.01 }).withMessage('Target amount must be positive'),
    body('targetDate').optional().isISO8601().withMessage('Invalid target date'),
    body('description').optional().trim(),
    body('status').optional().isIn(['active', 'completed', 'paused']),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, targetAmount, targetDate, description, status } = req.body;
      const goal = await SavingsGoal.create({
        user: req.user.id,
        name,
        targetAmount,
        targetDate,
        description,
        status,
      });
      return res.status(201).json({ success: true, message: 'Savings goal created', data: { goal } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// PATCH /api/savings-goals/:id
// ---------------------------------------------------------------------------
router.patch(
  '/:id',
  [...validateId,
    body('name').optional().trim().notEmpty().isLength({ max: 200 }),
    body('targetAmount').optional().isFloat({ min: 0.01 }),
    body('targetDate').optional().isISO8601(),
    body('description').optional().trim(),
    body('status').optional().isIn(['active', 'completed', 'paused']),
  ],
  validate,
  async (req, res, next) => {
    try {
      const allowed = ['name', 'targetAmount', 'targetDate', 'description', 'status'];
      const updates = {};
      for (const f of allowed) {
        if (req.body[f] !== undefined) updates[f] = req.body[f];
      }

      const goal = await SavingsGoal.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $set: updates },
        { new: true, runValidators: true }
      );
      if (!goal) return res.status(404).json({ success: false, message: 'Savings goal not found' });
      return res.json({ success: true, message: 'Savings goal updated', data: { goal } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// DELETE /api/savings-goals/:id
// ---------------------------------------------------------------------------
router.delete('/:id', validateId, validate, async (req, res, next) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!goal) return res.status(404).json({ success: false, message: 'Savings goal not found' });
    return res.json({ success: true, message: 'Savings goal deleted' });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/savings-goals/:id/contribute
// ---------------------------------------------------------------------------
router.post(
  '/:id/contribute',
  [...validateId,
    body('amount').isFloat({ min: 0.01 }).withMessage('Contribution amount must be at least 0.01'),
    body('type').isIn(['deposit', 'withdrawal']).withMessage('Type must be deposit or withdrawal'),
    body('note').optional().trim(),
    body('date').optional().isISO8601().withMessage('Invalid date'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { amount, type, note, date } = req.body;

      const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user.id });
      if (!goal) return res.status(404).json({ success: false, message: 'Savings goal not found' });

      const delta = type === 'deposit' ? amount : -amount;
      const newAmount = goal.currentAmount + delta;

      if (newAmount < 0) {
        return res.status(400).json({
          success: false,
          message: 'Withdrawal would result in negative balance. Current balance: ' + goal.currentAmount,
        });
      }

      const contribution = { amount, type, note, date: date ? new Date(date) : new Date() };

      const updatedGoal = await SavingsGoal.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        {
          $push: { contributions: contribution },
          $set: {
            currentAmount: newAmount,
            // Auto-complete if target reached
            status: newAmount >= goal.targetAmount ? 'completed' : goal.status,
          },
        },
        { new: true }
      );

      return res.status(201).json({
        success: true,
        message: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} recorded`,
        data: { goal: updatedGoal },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
