// controllers/adminController.js
const knex = require("../db");
const {
  createExamSchema,
  addExamDaySchema,
  createSlotSchema,
  generatePaperSchema,
  rescheduleStudentSchema,
} = require("../validators/adminValidators");

const paperGenerator = require("../services/paperGenerator");

exports.createExam = async (req, res, next) => {
  try {
    const { error } = createExamSchema.validate({
      ...req.body,
      created_by: req.user.id,
    });
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { title, round_number, description, created_by } = req.body;
    const [examId] = await knex("exams").insert({
      title,
      round_number,
      description,
      status: "1",
      created_by: created_by,
      created_at: knex.fn.now(),
    });
    res.status(201).json({ message: "Exam created", examId });
  } catch (err) {
    next(err);
  }
};

exports.addExamDay = async (req, res, next) => {
  try {
    const examId = parseInt(req.params.examId);
    if (isNaN(examId))
      return res.status(400).json({ message: "Invalid examId" });

    const { error } = addExamDaySchema.validate({ examId, ...req.body });
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { exam_date } = req.body;
    const [dayId] = await knex("exam_days").insert({
      exam_id: examId,
      exam_date,
    });
    res.status(201).json({ message: "Exam day added", dayId });
  } catch (err) {
    next(err);
  }
};

exports.createSlot = async (req, res, next) => {
  try {
    const { error } = createSlotSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { exam_day_id, start_time, end_time } = req.body;

    // Optional: Validate that exam_day_id exists first
    const examDay = await knex("exam_days").where({ id: exam_day_id }).first();
    if (!examDay)
      return res.status(400).json({ message: "Invalid exam_day_id" });

    const [slotId] = await knex("slots").insert({
      exam_day_id,
      start_time,
      end_time,
    });
    res.status(201).json({ message: "Slot created", slotId });
  } catch (err) {
    next(err);
  }
};

exports.generatePaper = async (req, res, next) => {
  try {
    const { error } = generatePaperSchema.validate({
      ...req.body,
      generated_by: req.user.id,
    });
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { examId, slotId, rules, generated_by } = req.body;

    const paperId = await paperGenerator.generatePaper(
      examId,
      slotId,
      rules,
      generated_by
    );

    res
      .status(201)
      .json({ message: "Paper generated and linked to slot", paperId });
  } catch (err) {
    next(err);
  }
};

exports.rescheduleStudent = async (req, res, next) => {
  try {
    const { error } = rescheduleStudentSchema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { registrationId, newSlotId, reason } = req.body;

    await knex.transaction(async (trx) => {
      const reg = await trx("exam_registrations")
        .where({ id: registrationId })
        .first();
      if (!reg) throw { statusCode: 404, message: "Registration not found" };

      // Update registration slot to newSlotId, status to 'rescheduled', and add reason
      await trx("exam_registrations").where({ id: registrationId }).update({
        slot_id: newSlotId,
        status: "rescheduled",
        reschedule_reason: reason,
        updated_by: req.user.id,
        updated_at: knex.fn.now(),
      });

      // Optionally: Keep track of reschedule history in a separate table (not shown here)
    });

    res.json({ message: "Student rescheduled successfully" });
  } catch (err) {
    next(err);
  }
};
