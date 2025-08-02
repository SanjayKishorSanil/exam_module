// controllers/authController.js
const db = require('../db');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwt');
const { registerSchema, loginSchema } = require('../validators/authValidators');

exports.register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, role } = req.body;

    const existing = await db('users').where({ email }).first();
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 10);

    const [id] = await db('users').insert({ name, email, password_hash, role });

    const token = generateToken({ id, email, role });

    res.status(201).json({ message: 'User registered', token, user: { id, name, email, role } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;
    const user = await db('users').where({ email }).first();
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    next(err);
  }
};
