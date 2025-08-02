// controllers/leaderboardController.js
const leaderboardService = require('../services/leaderboardService');

exports.getSlotLeaderboard = async (req, res, next) => {
  try {
    const slotId = parseInt(req.params.slotId);
    if (isNaN(slotId)) return res.status(400).json({ message: 'Invalid slotId' });

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const offset = (page - 1) * pageSize;

    const leaderboard = await leaderboardService.generateSlotLeaderboard(slotId, pageSize, offset);
    res.json({ page, pageSize, leaderboard });
  } catch (err) {
    next(err);
  }
};

exports.getFinalLeaderboard = async (req, res, next) => {
  try {
    const examId = parseInt(req.params.examId);
    if (isNaN(examId)) return res.status(400).json({ message: 'Invalid examId' });

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;
    const offset = (page - 1) * pageSize;

    const leaderboard = await leaderboardService.generateFinalLeaderboard(examId, pageSize, offset);
    res.json({ page, pageSize, leaderboard });
  } catch (err) {
    next(err);
  }
};
