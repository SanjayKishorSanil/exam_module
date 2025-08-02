// services/leaderboardService.js
const knex = require('../db');

/**
 * Generate leaderboard for a slot:
 * - Completed registrations in the slot
 * - Exclude flagged students
 * - Calculate scores by comparing answers with correct options
 * - Supports pagination
 */
exports.generateSlotLeaderboard = async (slotId, limit = 20, offset = 0) => {
  // Get all completed registrations for the slot, excluding flagged ones
  const flaggedRegs = await knex('proctor_flags')
    .join('exam_registrations', 'proctor_flags.registration_id', 'exam_registrations.id')
    .where('exam_registrations.slot_id', slotId)
    .pluck('registration_id');

  const registrations = await knex('exam_registrations')
    .where({ slot_id: slotId, status: 'completed' })
    .whereNotIn('id', flaggedRegs)
    .limit(limit)
    .offset(offset);

  // For each registration, calculate score
  const leaderboard = [];
  for (const reg of registrations) {
    // Get answers with correct options
    const answers = await knex('answers')
      .select('answers.selected_option', 'options.option_label')
      .join('paper_questions', 'answers.paper_question_id', 'paper_questions.id')
      .join('options', function () {
        this.on('options.question_id', '=', 'paper_questions.question_id')
          .andOn('options.is_correct', '=', knex.raw('true'));
      })
      .where('answers.registration_id', reg.id);

    // Calculate score
    let score = 0;
    answers.forEach(ans => {
      if (ans.selected_option === ans.option_label) score++;
    });

    leaderboard.push({ registrationId: reg.id, studentId: reg.student_id, score });
  }

  // Sort leaderboard by score descending
  leaderboard.sort((a, b) => b.score - a.score);

  return leaderboard;
};

/**
 * Generate final leaderboard for entire exam:
 * - Only best score per student from all completed attempts
 * - Exclude flagged attempts
 */
exports.generateFinalLeaderboard = async (examId, limit = 20, offset = 0) => {
  const flaggedRegs = await knex('proctor_flags')
    .join('exam_registrations', 'proctor_flags.registration_id', 'exam_registrations.id')
    .whereIn('exam_registrations.exam_id', [examId])
    .pluck('registration_id');

  // Select all completed registrations for exam excluding flagged
  const registrations = await knex('exam_registrations')
    .where({ exam_id: examId, status: 'completed' })
    .whereNotIn('id', flaggedRegs);

  // Calculate scores for each registration
  const studentBestScores = {};

  for (const reg of registrations) {
    const answers = await knex('answers')
      .select('answers.selected_option', 'options.option_label')
      .join('paper_questions', 'answers.paper_question_id', 'paper_questions.id')
      .join('options', function () {
        this.on('options.question_id', '=', 'paper_questions.question_id')
          .andOn('options.is_correct', '=', knex.raw('true'));
      })
      .where('answers.registration_id', reg.id);

    let score = 0;
    answers.forEach(ans => {
      if (ans.selected_option === ans.option_label) score++;
    });

    if (
      !studentBestScores[reg.student_id] ||
      studentBestScores[reg.student_id].score < score
    ) {
      studentBestScores[reg.student_id] = { registrationId: reg.id, score };
    }
  }

  // Convert to array and sort by score descending
  const leaderboard = Object.entries(studentBestScores)
    .map(([studentId, { registrationId, score }]) => ({
      studentId: parseInt(studentId),
      registrationId,
      score,
    }))
    .sort((a, b) => b.score - a.score);

  // Apply pagination
  return leaderboard.slice(offset, offset + limit);
};
