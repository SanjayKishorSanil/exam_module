// middlewares/roleMiddleware.js
module.exports = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role))
    return res.status(403).json({ message: 'Forbidden: insufficient privileges.' });
  next();
};
