// routes/proctor.js
const express = require('express');
const router = express.Router();
const proctorController = require('../controllers/proctorController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

router.post('/flag', auth, role('proctor'), proctorController.flagStudent);

module.exports = router;
