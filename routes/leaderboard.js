// routes/leaderboard.js
const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboardController');
const auth = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');

// Assuming leaderboard viewing might be open or restricted; roles can be adjusted

// Get leaderboard for slot (admin or public view)
router.get('/slot/:slotId', auth, role('admin', 'student', 'proctor'), leaderboardController.getSlotLeaderboard);

// Get final leaderboard for exam (admin only)
router.get('/final/:examId', auth, role('admin'), leaderboardController.getFinalLeaderboard);

module.exports = router;
