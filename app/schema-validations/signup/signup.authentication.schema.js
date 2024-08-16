import Joi from 'joi';

const PASSWORD_REGEX = new RegExp(
  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-.]).{8,}$'
);

const signupAuthenticationSchema = Joi.alternatives().try(
  Joi.object({
    email: Joi.string().email().required(),

    password: Joi.string().pattern(PASSWORD_REGEX).required(),

    passwordConfirm: Joi.string().pattern(PASSWORD_REGEX).required(),

    pseudo:
      Joi.string()
      .required(),
  }).length(4)
);

export default signupAuthenticationSchema;
