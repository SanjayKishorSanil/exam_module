// services/paperGenerator.js
const knex = require('../db');

/**
 * Generate a paper for a given exam and slot based on rules
 * rules = { easy: 10, medium: 5, hard: 5 }
 */
exports.generatePaper = async (examId, slotId, rules) => {
  return knex.transaction(async (trx) => {
    // 1. Select questions by difficulty randomly
    let questionIds = [];

    for (const difficulty of ['easy', 'medium', 'hard']) {
      const count = rules[difficulty] || 0;
      if (count > 0) {
        const selected = await trx('questions')
          .where({ exam_id: examId, difficulty })
          .orderByRaw('RAND()')
          .limit(count)
          .select('id');
        questionIds = questionIds.concat(selected.map((q) => q.id));
      }
    }

    // 2. Insert paper
    const [paperId] = await trx('papers').insert({
      exam_id: examId,
      generated_by: null, // set admin user id if available
      generated_at: knex.fn.now(),
    });

    // 3. Insert paper_questions with order
    const paperQuestionsData = questionIds.map((qid, idx) => ({
      paper_id: paperId,
      question_id: qid,
      question_order: idx + 1,
    }));
    await trx('paper_questions').insert(paperQuestionsData);

    // 4. Link paper to slot
    await trx('slots').where({ id: slotId }).update({ paper_id: paperId });

    return paperId;
  });
};
