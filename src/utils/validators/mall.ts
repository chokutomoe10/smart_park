import Joi = require("joi");

export const createdMallSchema = Joi.object().keys({
  name: Joi.string().required().max(100),
  district: Joi.string().required().max(100),
  address: Joi.string().required().max(100),
  image: Joi.string().required().max(100),
});
