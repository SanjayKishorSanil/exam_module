// controllers/studentController.js
const knex = require('../db');
const { registerForExamSchema, submitAnswersSchema } = require('../validators/studentValidators');

exports.registerForExam = async (req, res, next) => {
  try {
    const { error } = registerForExamSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { studentId, examId, slotId } = req.body;

    await knex.transaction(async (trx) => {
      // Check if the slot belongs to the exam
      const slot = await trx('slots').where({ id: slotId }).first();
      if (!slot) throw { statusCode: 400, message: 'Invalid slot ID' };

      const examDay = await trx('exam_days').where({ id: slot.exam_day_id }).first();
      if (!examDay || examDay.exam_id !== examId)
        throw { statusCode: 400, message: 'Slot does not belong to this exam' };

      // Prevent multiple slot registrations for same exam & student
      const existingRegistration = await trx('exam_registrations')
        .where({ student_id: studentId, exam_id: examId ,status: '1'})
        .first();

      if (existingRegistration)
        throw { statusCode: 400, message: 'Student already registered for this exam' };

      // Get paper linked to slot
    //   const slotWithPaper = await trx('slots').where({ id: slotId }).first();
    //   if (!slotWithPaper.paper_id)
    //     throw { statusCode: 400, message: 'No question paper assigned to this slot yet' };

      // Insert registration
      const [registrationId] = await trx('exam_registrations').insert({
        student_id: studentId,
        exam_id: examId,
        slot_id: slotId,
        status: 'registered',
        registered_at: knex.fn.now(),
      });

      // Success response
      res.status(201).json({ message: 'Registered for exam successfully', registrationId });
    });
  } catch (err) {
    next(err);
  }
};

exports.submitAnswers = async (req, res, next) => {
  try {
    const { error } = submitAnswersSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { registrationId, answers } = req.body;

    await knex.transaction(async (trx) => {
      // Validate registration status
      const registration = await trx('exam_registrations').where({ id: registrationId }).first();

      if (!registration || registration.status !== 'registered')
        throw { statusCode: 400, message: 'Invalid or completed registration' };

      // Delete any existing answers for this registration (for resubmission scenarios)
      await trx('answers').where({ registration_id: registrationId }).del();

      // Insert new answers
      const answersToInsert = answers.map((a) => ({
        registration_id: registrationId,
        paper_question_id: a.paperQuestionId,
        selected_option: a.selectedOption,
        answered_at: knex.fn.now(),
      }));
      await trx('answers').insert(answersToInsert);

      // Update registration status to completed
      await trx('exam_registrations').where({ id: registrationId }).update({ status: 'completed' });

      res.status(200).json({ message: 'Answers submitted successfully' });
    });
  } catch (err) {
    next(err);
  }
};
