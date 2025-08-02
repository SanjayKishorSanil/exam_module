// validators/proctorValidators.js
const Joi = require('joi');

exports.flagStudentSchema = Joi.object({
  registrationId: Joi.number().integer().required(),
  reason: Joi.string().min(5).max(255).required(),
  notes: Joi.string().allow('', null),
  flaggedBy: Joi.number().integer().required(),
});
