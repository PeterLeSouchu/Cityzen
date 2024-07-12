import Joi from "joi";

const profilFavoritePostSchema = Joi.object({
  id: Joi.number()
    .positive()
    .min(1)
    .required()
})
.length(1)
.required();

export default profilFavoritePostSchema;