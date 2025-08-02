// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'exam_secret_123';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token, authorization denied.' });

  const token = authHeader.split(' ')[1]; // Expect Bearer <token>
  if (!token) return res.status(401).json({ message: 'No token, authorization denied.' });

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { id, role, email, etc }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid.' });
  }
};
