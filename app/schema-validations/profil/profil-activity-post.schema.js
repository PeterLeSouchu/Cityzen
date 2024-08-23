import Joi from 'joi';

const profilActivityPostSchema = Joi.object({
  title: Joi.string().min(2).required(),

  description: Joi.string().min(2).required(),

  address: Joi.string().min(2).required(),

  phone: Joi.string().pattern(/^0[1-9]{1}[0-9]{8}$/),
  city: Joi.string().min(2).required(),
})
  .min(4)
  .max(5);

export default profilActivityPostSchema;
