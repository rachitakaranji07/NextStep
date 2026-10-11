import express from 'express';
import { query } from 'express-validator';
import mongoose from 'mongoose';
import CareerGoal from '../models/CareerGoal.js';
import JobApplication from '../models/JobApplication.js';
import Transaction from '../models/Transaction.js';
import Budget from '../models/Budget.js';
import SavingsGoal from '../models/SavingsGoal.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.use(auth);

// ---------------------------------------------------------------------------
// GET /api/dashboard/summary?month=&year=
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
      const userId = new mongoose.Types.ObjectId(req.user.id);

      const [
        careerGoalStats,
        applicationStats,
        financialSummary,
        budgetCount,
        savingsStats,
        recentTransactions,
        upcomingTasks,
      ] = await Promise.all([
        // Career goals: total count + active count
        CareerGoal.aggregate([
          { $match: { user: userId } },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
              completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
            },
          },
        ]),

        // Job applications by status
        JobApplication.aggregate([
          { $match: { user: userId } },
          { $group: { _id: '$status', count: { $sum: 1 } } },
        ]),

        // Financial summary for the requested month
        Transaction.aggregate([
          {
            $match: {
              user: userId,
              date: { $gte: startDate, $lte: endDate },
            },
          },
          {
            $group: {
              _id: '$type',
              total: { $sum: '$amount' },
            },
          },
        ]),

        // Budget count for the month
        Budget.countDocuments({ user: req.user.id, month, year }),

        // Savings goals summary
        SavingsGoal.aggregate([
          { $match: { user: userId } },
          {
            $group: {
              _id: null,
              totalTarget: { $sum: '$targetAmount' },
              totalSaved: { $sum: '$currentAmount' },
              count: { $sum: 1 },
              active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            },
          },
        ]),

        // Last 5 transactions
        Transaction.find({ user: req.user.id })
          .sort({ date: -1 })
          .limit(5)
          .lean(),

        // Upcoming tasks from active career goals (due within 30 days, not completed)
        CareerGoal.aggregate([
          { $match: { user: userId, status: 'active' } },
          { $unwind: '$tasks' },
          {
            $match: {
              'tasks.status': { $ne: 'completed' },
              'tasks.dueDate': {
                $gte: now,
                $lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
              },
            },
          },
          {
            $project: {
              goalTitle: '$title',
              task: '$tasks',
            },
          },
          { $sort: { 'tasks.dueDate': 1 } },
          { $limit: 10 },
        ]),
      ]);

      // Normalize career goal stats
      const cgStats = careerGoalStats[0] || { total: 0, active: 0, completed: 0 };

      // Normalize application stats
      const appStatuses = ['saved', 'applied', 'assessment', 'interview', 'offer', 'rejected'];
      const appStats = appStatuses.reduce((acc, s) => ({ ...acc, [s]: 0 }), { total: 0 });
      applicationStats.forEach(({ _id, count }) => {
        appStats[_id] = count;
        appStats.total += count;
      });

      // Normalize financial summary
      const income = financialSummary.find((f) => f._id === 'income')?.total || 0;
      const expenses = financialSummary.find((f) => f._id === 'expense')?.total || 0;

      // Normalize savings
      const savings = savingsStats[0] || { totalTarget: 0, totalSaved: 0, count: 0, active: 0 };

      return res.json({
        success: true,
        data: {
          period: { month, year },
          careerGoals: {
            total: cgStats.total,
            active: cgStats.active,
            completed: cgStats.completed,
          },
          applications: appStats,
          finances: {
            income,
            expenses,
            netBalance: income - expenses,
          },
          budgets: {
            count: budgetCount,
          },
          savingsGoals: {
            count: savings.count,
            active: savings.active,
            totalTarget: savings.totalTarget,
            totalSaved: savings.totalSaved,
            overallProgress:
              savings.totalTarget > 0
                ? Math.round((savings.totalSaved / savings.totalTarget) * 100)
                : 0,
          },
          recentTransactions,
          upcomingTasks,
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
