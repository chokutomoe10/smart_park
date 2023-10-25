import Joi = require("joi");

export const loginSchema = Joi.object().keys({
  username: Joi.string().required().min(4).max(100),
  password: Joi.string().required(),
});
