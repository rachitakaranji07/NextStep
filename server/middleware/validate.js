import { validationResult } from 'express-validator';

/**
 * Runs express-validator checks and returns 400 with structured errors if any fail.
 * Usage: router.post('/route', [validators...], validate, handler)
 */
const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: result.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

export default validate;
