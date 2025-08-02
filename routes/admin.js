// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

router.post('/exam', auth, role('admin'), adminController.createExam);
router.post('/exam/:examId/day', auth, role('admin'), adminController.addExamDay);
router.post('/slot', auth, role('admin'), adminController.createSlot);
router.post('/paper/generate', auth, role('admin'), adminController.generatePaper);
router.post('/reschedule', auth, role('admin'), adminController.rescheduleStudent);

module.exports = router;
