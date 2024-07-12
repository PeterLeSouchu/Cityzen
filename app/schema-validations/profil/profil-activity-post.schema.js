import Joi from "joi";

const profilActivityPostSchema = Joi.object({
  title: Joi.string()
    .min(2)
    .required(),

  description: Joi.string()
    .min(2)
    .required(),

  image: Joi.string()
    .min(2)
    .required(),

  address: Joi.string()
    .min(2)
    .required(),

  phone: Joi.string()
    .pattern(/^0[1-9]{1}[0-9]{8}$/),

  longitude: Joi.number()
    .required(),

  latitude: Joi.number()
    .required(),

  city:Joi.string()
    .min(2)
    .required()
})
.min(7)
.max(9);

export default profilActivityPostSchema;