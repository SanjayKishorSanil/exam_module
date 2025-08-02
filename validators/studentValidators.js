// validators/studentValidators.js
const Joi = require('joi');

exports.registerForExamSchema = Joi.object({
  studentId: Joi.number().integer().required(),
  examId: Joi.number().integer().required(),
  slotId: Joi.number().integer().required(),
});

exports.submitAnswersSchema = Joi.object({
  registrationId: Joi.number().integer().required(),
  answers: Joi.array().items(
    Joi.object({
      paperQuestionId: Joi.number().integer().required(),
      selectedOption: Joi.string().valid('A', 'B', 'C', 'D').required(),
    })
  ).min(1).required(),
});
