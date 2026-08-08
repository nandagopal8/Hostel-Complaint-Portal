/**
 * Admin-only middleware.
 * Must be used AFTER the protect middleware.
 * Blocks any user whose role is not 'admin'.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403).json({ message: 'Access denied: Admins only' });
};

export { adminOnly };
