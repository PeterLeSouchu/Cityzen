import Joi from "joi";

const updateSchema = (paramsValidation, bodyValidation) => Joi.object({
  params: paramsValidation,
  body: bodyValidation
})
.unknown(true) // We ignore other parameters provided by req


export default updateSchema;