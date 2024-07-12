import Joi from "joi";

const profilActivityPatchSchema = Joi.object({
  title: Joi.string()
  .min(2),

  description: Joi.string()
    .min(2),

  image: Joi.string()
    .min(2),

  address: Joi.string()
    .min(2),

  phone: Joi.string()
    .pattern(/^0[1-9]{1}[0-9]{8}$/),

  longitude: Joi.number(),

  latitude: Joi.number(),

  city: Joi.string()
    .min(2)
})
.min(1)
.max(8)
.or(  'title', 'description', 'image', 'address', 'phone', 'longitude', 'latitude', 'city');

export default profilActivityPatchSchema;