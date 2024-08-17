import Joi from 'joi';

const profilActivityPatchSchema = Joi.object({
  title: Joi.string().min(2),

  description: Joi.string().min(2),

  image: Joi.string(),

  address: Joi.string().min(2),

  phone: Joi.string().pattern(/^0[1-9]{1}[0-9]{8}$/),

  city: Joi.string().min(2),
})
  .min(1)
  .max(6)
  .or('title', 'description', 'image', 'address', 'phone', 'city');

export default profilActivityPatchSchema;
