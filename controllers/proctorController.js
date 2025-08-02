// controllers/proctorController.js
const knex = require('../db');
const { flagStudentSchema } = require('../validators/proctorValidators');

exports.flagStudent = async (req, res, next) => {
  try {
    // Include flaggedBy either from req.body or req.user.id
    const flaggedBy = req.user.id;
    const { error } = flagStudentSchema.validate({ ...req.body, flaggedBy });
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { registrationId, reason, notes } = req.body;

    await knex('proctor_flags').insert({
      registration_id: registrationId,
      flagged_by: flaggedBy,
      reason,
      notes,
      flagged_at: knex.fn.now(),
    });
    res.status(201).json({ message: 'Student flagged successfully' });
  } catch (err) {
    next(err);
  }
};
