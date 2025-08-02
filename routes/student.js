// routes/student.js
const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

// Student must be logged in and have 'student' role
router.post('/register', auth, role('student'), studentController.registerForExam);
router.post('/answer', auth, role('student'), studentController.submitAnswers);

module.exports = router;
