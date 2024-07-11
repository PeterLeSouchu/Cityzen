import Joi from "joi";

const profilFavoriteDeleteSchema = Joi.object({
  id: Joi.number()
    .positive()
    .min(1)
    .required()
})
.length(1)
.required();

export default profilFavoriteDeleteSchema;