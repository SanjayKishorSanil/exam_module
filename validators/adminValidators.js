// validators/adminValidators.js
const Joi = require('joi');

exports.createExamSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  round_number: Joi.number().integer().min(1).default(1),
  description: Joi.string().allow('', null),
  created_by: Joi.number().integer().required(),
});

exports.addExamDaySchema = Joi.object({
  examId: Joi.number().integer().required(),
  exam_date: Joi.date().required(),
});

exports.createSlotSchema = Joi.object({
  exam_day_id: Joi.number().integer().required(),
  start_time: Joi.string().required(), // 'HH:MM:SS' format expected
  end_time: Joi.string().required(),
});

exports.generatePaperSchema = Joi.object({
  examId: Joi.number().integer().required(),
  slotId: Joi.number().integer().required(),
  rules: Joi.object({
    easy: Joi.number().integer().min(0).required(),
    medium: Joi.number().integer().min(0).required(),
    hard: Joi.number().integer().min(0).required()
  }).required(),
  generated_by: Joi.number().integer().required(),
});

exports.rescheduleStudentSchema = Joi.object({
  registrationId: Joi.number().integer().required(),
  newSlotId: Joi.number().integer().required(),
  reason: Joi.string().min(5).max(255).required(),
});
