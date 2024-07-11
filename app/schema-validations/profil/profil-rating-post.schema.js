import Joi from "joi";

const profilRatingPostSchema = Joi.object({
  rating: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required(),
});

export default profilRatingPostSchema;