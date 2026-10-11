import express from 'express';
import { body, query, param } from 'express-validator';
import mongoose from 'mongoose';
import CareerGoal from '../models/CareerGoal.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

/** Validate that :id is a valid ObjectId */
const validateId = [
  param('id').custom((val) => {
    if (!mongoose.Types.ObjectId.isValid(val)) throw new Error('Invalid goal ID');
    return true;
  }),
];

const validateSubId = (paramName) => [
  param(paramName).custom((val) => {
    if (!mongoose.Types.ObjectId.isValid(val)) throw new Error(`Invalid ${paramName}`);
    return true;
  }),
];

// ---------------------------------------------------------------------------
// GET /api/career-goals
// ---------------------------------------------------------------------------
router.get('/', async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { user: req.user.id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [goals, total] = await Promise.all([
      CareerGoal.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(parseInt(limit)),
      CareerGoal.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      data: {
        goals,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
      },
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/career-goals/:id
// ---------------------------------------------------------------------------
router.get('/:id', validateId, validate, async (req, res, next) => {
  try {
    const goal = await CareerGoal.findOne({ _id: req.params.id, user: req.user.id });
    if (!goal) return res.status(404).json({ success: false, message: 'Career goal not found' });
    return res.json({ success: true, data: { goal } });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/career-goals
// ---------------------------------------------------------------------------
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }),
    body('targetRole').optional().trim(),
    body('description').optional().trim(),
    body('targetDate').optional().isISO8601().withMessage('Invalid target date'),
    body('status').optional().isIn(['draft', 'active', 'completed', 'paused']).withMessage('Invalid status'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, targetRole, description, targetDate, status } = req.body;
      const goal = await CareerGoal.create({
        user: req.user.id,
        title,
        targetRole,
        description,
        targetDate,
        status,
      });
      return res.status(201).json({ success: true, message: 'Career goal created', data: { goal } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// PATCH /api/career-goals/:id  (update top-level fields)
// ---------------------------------------------------------------------------
router.patch(
  '/:id',
  [...validateId,
    body('title').optional().trim().notEmpty().isLength({ max: 200 }),
    body('targetRole').optional().trim(),
    body('description').optional().trim(),
    body('targetDate').optional().isISO8601().withMessage('Invalid target date'),
    body('status').optional().isIn(['draft', 'active', 'completed', 'paused']),
  ],
  validate,
  async (req, res, next) => {
    try {
      const allowed = ['title', 'targetRole', 'description', 'targetDate', 'status'];
      const updates = {};
      for (const f of allowed) {
        if (req.body[f] !== undefined) updates[f] = req.body[f];
      }

      const goal = await CareerGoal.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $set: updates },
        { new: true, runValidators: true }
      );
      if (!goal) return res.status(404).json({ success: false, message: 'Career goal not found' });
      return res.json({ success: true, message: 'Career goal updated', data: { goal } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// DELETE /api/career-goals/:id
// ---------------------------------------------------------------------------
router.delete('/:id', validateId, validate, async (req, res, next) => {
  try {
    const goal = await CareerGoal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!goal) return res.status(404).json({ success: false, message: 'Career goal not found' });
    return res.json({ success: true, message: 'Career goal deleted' });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// PATCH /api/career-goals/:id/milestones  (replace entire milestones array)
// ---------------------------------------------------------------------------
router.patch(
  '/:id/milestones',
  [...validateId,
    body('milestones').isArray().withMessage('milestones must be an array'),
    body('milestones.*.title').trim().notEmpty().withMessage('Milestone title is required'),
    body('milestones.*.status').optional().isIn(['pending', 'in-progress', 'completed']),
    body('milestones.*.dueDate').optional().isISO8601().withMessage('Invalid due date'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const goal = await CareerGoal.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $set: { milestones: req.body.milestones } },
        { new: true, runValidators: true }
      );
      if (!goal) return res.status(404).json({ success: false, message: 'Career goal not found' });
      return res.json({ success: true, message: 'Milestones updated', data: { goal } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// POST /api/career-goals/:id/milestones  (add a single milestone)
// ---------------------------------------------------------------------------
router.post(
  '/:id/milestones',
  [...validateId,
    body('title').trim().notEmpty().withMessage('Milestone title is required'),
    body('status').optional().isIn(['pending', 'in-progress', 'completed']),
    body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, description, dueDate, status } = req.body;
      const goal = await CareerGoal.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $push: { milestones: { title, description, dueDate, status } } },
        { new: true, runValidators: true }
      );
      if (!goal) return res.status(404).json({ success: false, message: 'Career goal not found' });
      return res.status(201).json({ success: true, message: 'Milestone added', data: { goal } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// PATCH /api/career-goals/:id/milestones/:milestoneId
// ---------------------------------------------------------------------------
router.patch(
  '/:id/milestones/:milestoneId',
  [...validateId, ...validateSubId('milestoneId')],
  validate,
  async (req, res, next) => {
    try {
      const { title, description, dueDate, status, completedAt } = req.body;
      const setObj = {};
      if (title !== undefined) setObj['milestones.$.title'] = title;
      if (description !== undefined) setObj['milestones.$.description'] = description;
      if (dueDate !== undefined) setObj['milestones.$.dueDate'] = dueDate;
      if (status !== undefined) {
        setObj['milestones.$.status'] = status;
        if (status === 'completed') setObj['milestones.$.completedAt'] = completedAt || new Date();
      }

      const goal = await CareerGoal.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id, 'milestones._id': req.params.milestoneId },
        { $set: setObj },
        { new: true }
      );
      if (!goal) return res.status(404).json({ success: false, message: 'Milestone not found' });
      return res.json({ success: true, message: 'Milestone updated', data: { goal } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// DELETE /api/career-goals/:id/milestones/:milestoneId
// ---------------------------------------------------------------------------
router.delete(
  '/:id/milestones/:milestoneId',
  [...validateId, ...validateSubId('milestoneId')],
  validate,
  async (req, res, next) => {
    try {
      const goal = await CareerGoal.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $pull: { milestones: { _id: req.params.milestoneId } } },
        { new: true }
      );
      if (!goal) return res.status(404).json({ success: false, message: 'Career goal not found' });
      return res.json({ success: true, message: 'Milestone deleted', data: { goal } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// POST /api/career-goals/:id/tasks  (add a task)
// ---------------------------------------------------------------------------
router.post(
  '/:id/tasks',
  [...validateId,
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('priority').optional().isIn(['low', 'medium', 'high']),
    body('status').optional().isIn(['todo', 'in-progress', 'completed']),
    body('dueDate').optional().isISO8601().withMessage('Invalid due date'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { title, description, dueDate, status, priority } = req.body;
      const goal = await CareerGoal.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $push: { tasks: { title, description, dueDate, status, priority } } },
        { new: true, runValidators: true }
      );
      if (!goal) return res.status(404).json({ success: false, message: 'Career goal not found' });
      return res.status(201).json({ success: true, message: 'Task added', data: { goal } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// PATCH /api/career-goals/:id/tasks/:taskId
// ---------------------------------------------------------------------------
router.patch(
  '/:id/tasks/:taskId',
  [...validateId, ...validateSubId('taskId')],
  validate,
  async (req, res, next) => {
    try {
      const { title, description, dueDate, status, priority } = req.body;
      const setObj = {};
      if (title !== undefined) setObj['tasks.$.title'] = title;
      if (description !== undefined) setObj['tasks.$.description'] = description;
      if (dueDate !== undefined) setObj['tasks.$.dueDate'] = dueDate;
      if (status !== undefined) setObj['tasks.$.status'] = status;
      if (priority !== undefined) setObj['tasks.$.priority'] = priority;

      const goal = await CareerGoal.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id, 'tasks._id': req.params.taskId },
        { $set: setObj },
        { new: true }
      );
      if (!goal) return res.status(404).json({ success: false, message: 'Task not found' });
      return res.json({ success: true, message: 'Task updated', data: { goal } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// DELETE /api/career-goals/:id/tasks/:taskId
// ---------------------------------------------------------------------------
router.delete(
  '/:id/tasks/:taskId',
  [...validateId, ...validateSubId('taskId')],
  validate,
  async (req, res, next) => {
    try {
      const goal = await CareerGoal.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $pull: { tasks: { _id: req.params.taskId } } },
        { new: true }
      );
      if (!goal) return res.status(404).json({ success: false, message: 'Career goal not found' });
      return res.json({ success: true, message: 'Task deleted', data: { goal } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// POST /api/career-goals/:id/skills  (add a skill)
// ---------------------------------------------------------------------------
router.post(
  '/:id/skills',
  [...validateId,
    body('name').trim().notEmpty().withMessage('Skill name is required'),
    body('currentLevel').optional().isInt({ min: 0, max: 5 }).withMessage('Level must be 0-5'),
    body('targetLevel').optional().isInt({ min: 0, max: 5 }).withMessage('Level must be 0-5'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { name, currentLevel, targetLevel, resources } = req.body;
      const goal = await CareerGoal.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $push: { skills: { name, currentLevel, targetLevel, resources } } },
        { new: true, runValidators: true }
      );
      if (!goal) return res.status(404).json({ success: false, message: 'Career goal not found' });
      return res.status(201).json({ success: true, message: 'Skill added', data: { goal } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// PATCH /api/career-goals/:id/skills/:skillId
// ---------------------------------------------------------------------------
router.patch(
  '/:id/skills/:skillId',
  [...validateId, ...validateSubId('skillId')],
  validate,
  async (req, res, next) => {
    try {
      const { name, currentLevel, targetLevel, resources } = req.body;
      const setObj = {};
      if (name !== undefined) setObj['skills.$.name'] = name;
      if (currentLevel !== undefined) setObj['skills.$.currentLevel'] = currentLevel;
      if (targetLevel !== undefined) setObj['skills.$.targetLevel'] = targetLevel;
      if (resources !== undefined) setObj['skills.$.resources'] = resources;

      const goal = await CareerGoal.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id, 'skills._id': req.params.skillId },
        { $set: setObj },
        { new: true }
      );
      if (!goal) return res.status(404).json({ success: false, message: 'Skill not found' });
      return res.json({ success: true, message: 'Skill updated', data: { goal } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// DELETE /api/career-goals/:id/skills/:skillId
// ---------------------------------------------------------------------------
router.delete(
  '/:id/skills/:skillId',
  [...validateId, ...validateSubId('skillId')],
  validate,
  async (req, res, next) => {
    try {
      const goal = await CareerGoal.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $pull: { skills: { _id: req.params.skillId } } },
        { new: true }
      );
      if (!goal) return res.status(404).json({ success: false, message: 'Career goal not found' });
      return res.json({ success: true, message: 'Skill deleted', data: { goal } });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
