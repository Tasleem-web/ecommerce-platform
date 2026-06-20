import Joi from 'joi';

// Reusable rating schema validator
const ratingSchema = Joi.object({
  rate: Joi.number().min(0).max(5).precision(1).required(),
  count: Joi.number().integer().min(0).required(),
});

export const createProductSchema = Joi.object({
  title: Joi.string().min(1).max(190).required(),
  category: Joi.string().min(1).max(190).required(),
  image: Joi.string().uri().max(190).required(), // .uri() ensures it is a valid URL string
  price: Joi.number().min(0).precision(2).required(),
  description: Joi.string().max(2000).allow('', null),
  stock: Joi.number().integer().min(0).default(0),

  // Nested rating validation
  rating: ratingSchema.default({ rate: 0, count: 0 }),
});

export const updateProductSchema = Joi.object({
  title: Joi.string().min(1).max(190),
  category: Joi.string().min(1).max(190),
  image: Joi.string().uri().max(190),
  price: Joi.number().min(0).precision(2),
  description: Joi.string().max(2000).allow('', null),
  stock: Joi.number().integer().min(0),

  // For updates, individual rating keys are optional inside the object
  rating: Joi.object({
    rate: Joi.number().min(0).max(5).precision(1),
    count: Joi.number().integer().min(0),
  }),
}).min(1);
