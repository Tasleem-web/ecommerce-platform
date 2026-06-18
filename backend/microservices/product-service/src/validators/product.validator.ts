import Joi from 'joi';

export const createProductSchema = Joi.object({
  name: Joi.string().min(1).max(190).required(),
  description: Joi.string().max(2000).allow('', null),
  price: Joi.number().min(0).precision(2).required(),
  stock: Joi.number().integer().min(0).default(0),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().min(1).max(190),
  description: Joi.string().max(2000).allow('', null),
  price: Joi.number().min(0).precision(2),
  stock: Joi.number().integer().min(0),
}).min(1);
