import Joi from 'joi';
const PASSWORD_REGEX = new RegExp(
  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-.]).{8,}$'
);

const profilPasswordUpdatePatchSchema = Joi.alternatives().try(
  Joi.object({
    oldPassword: Joi.string().required(),

    newPassword: Joi.string().pattern(PASSWORD_REGEX).required(),

    newPasswordConfirm: Joi.string().pattern(PASSWORD_REGEX).required(),
  }).length(3)
);

export default profilPasswordUpdatePatchSchema;
