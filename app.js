// app.js
require('dotenv').config();

const express = require('express');
const knex = require('./db'); // your knex instance setup file
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');
const proctorRoutes = require('./routes/proctor');

const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(helmet()); // secure HTTP headers
app.use(cors());
app.use(morgan('dev')); // logging HTTP requests
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true }));

// Routes (Prefix routes according to role/access)
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/proctor', proctorRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: Date.now() });
});

// 404 - Route Not Found Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Global Error Handler Middleware (capture all errors)
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Exam system backend running on port ${PORT}`);
});

module.exports = app;
