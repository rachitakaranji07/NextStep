import jwt from 'jsonwebtoken';

/**
 * Verifies the JWT from the HTTP-only cookie.
 * Sets req.user = { id, email, name } on success.
 */
const auth = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch (err) {
    // Let the error handler deal with JWT-specific errors
    next(err);
  }
};

export default auth;
