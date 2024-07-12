import Joi from "joi";

const paramsSchema = Joi.object({
  id: Joi.number()
    .min(1)
    .positive()
    .required()
});

export default paramsSchema;