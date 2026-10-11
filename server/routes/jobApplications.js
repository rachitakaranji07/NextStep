import express from 'express';
import { body, param, query } from 'express-validator';
import mongoose from 'mongoose';
import JobApplication from '../models/JobApplication.js';
import auth from '../middleware/auth.js';
import validate from '../middleware/validate.js';

const router = express.Router();

router.use(auth);

const VALID_STATUSES = ['saved', 'applied', 'assessment', 'interview', 'offer', 'rejected'];

const validateId = [
  param('id').custom((val) => {
    if (!mongoose.Types.ObjectId.isValid(val)) throw new Error('Invalid application ID');
    return true;
  }),
];

// ---------------------------------------------------------------------------
// GET /api/job-applications?status=&search=&page=&limit=
// ---------------------------------------------------------------------------
router.get(
  '/',
  [
    query('status').optional().isIn(VALID_STATUSES).withMessage('Invalid status filter'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { status, search, page = 1, limit = 20 } = req.query;
      const filter = { user: req.user.id };

      if (status) filter.status = status;
      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [{ company: regex }, { jobTitle: regex }];
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const [applications, total] = await Promise.all([
        JobApplication.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(parseInt(limit)),
        JobApplication.countDocuments(filter),
      ]);

      return res.json({
        success: true,
        data: {
          applications,
          pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
        },
      });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// GET /api/job-applications/stats  (breakdown by status)
// ---------------------------------------------------------------------------
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await JobApplication.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const result = VALID_STATUSES.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
    stats.forEach(({ _id, count }) => {
      result[_id] = count;
    });
    result.total = stats.reduce((sum, s) => sum + s.count, 0);

    return res.json({ success: true, data: { stats: result } });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/job-applications/:id
// ---------------------------------------------------------------------------
router.get('/:id', validateId, validate, async (req, res, next) => {
  try {
    const application = await JobApplication.findOne({ _id: req.params.id, user: req.user.id });
    if (!application) return res.status(404).json({ success: false, message: 'Job application not found' });
    return res.json({ success: true, data: { application } });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// POST /api/job-applications
// ---------------------------------------------------------------------------
router.post(
  '/',
  [
    body('company').trim().notEmpty().withMessage('Company name is required'),
    body('jobTitle').trim().notEmpty().withMessage('Job title is required'),
    body('jobUrl').optional().trim().isURL().withMessage('Invalid URL'),
    body('status').optional().isIn(VALID_STATUSES).withMessage('Invalid status'),
    body('applicationDate').optional().isISO8601().withMessage('Invalid application date'),
    body('followUpDate').optional().isISO8601().withMessage('Invalid follow-up date'),
    body('remote').optional().isBoolean().withMessage('remote must be boolean'),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { company, jobTitle, jobUrl, applicationDate, status, notes, followUpDate, salary, location, remote } = req.body;
      const application = await JobApplication.create({
        user: req.user.id,
        company,
        jobTitle,
        jobUrl,
        applicationDate,
        status,
        notes,
        followUpDate,
        salary,
        location,
        remote,
      });
      return res.status(201).json({ success: true, message: 'Job application created', data: { application } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// PATCH /api/job-applications/:id
// ---------------------------------------------------------------------------
router.patch(
  '/:id',
  [...validateId,
    body('company').optional().trim().notEmpty(),
    body('jobTitle').optional().trim().notEmpty(),
    body('jobUrl').optional().trim().isURL().withMessage('Invalid URL'),
    body('status').optional().isIn(VALID_STATUSES).withMessage('Invalid status'),
    body('applicationDate').optional().isISO8601().withMessage('Invalid date'),
    body('followUpDate').optional().isISO8601().withMessage('Invalid date'),
    body('remote').optional().isBoolean(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const allowed = ['company', 'jobTitle', 'jobUrl', 'applicationDate', 'status', 'notes', 'followUpDate', 'salary', 'location', 'remote'];
      const updates = {};
      for (const f of allowed) {
        if (req.body[f] !== undefined) updates[f] = req.body[f];
      }

      const application = await JobApplication.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $set: updates },
        { new: true, runValidators: true }
      );
      if (!application) return res.status(404).json({ success: false, message: 'Job application not found' });
      return res.json({ success: true, message: 'Application updated', data: { application } });
    } catch (err) {
      next(err);
    }
  }
);

// ---------------------------------------------------------------------------
// DELETE /api/job-applications/:id
// ---------------------------------------------------------------------------
router.delete('/:id', validateId, validate, async (req, res, next) => {
  try {
    const application = await JobApplication.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!application) return res.status(404).json({ success: false, message: 'Job application not found' });
    return res.json({ success: true, message: 'Job application deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
