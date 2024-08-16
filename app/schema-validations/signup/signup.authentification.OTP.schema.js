import Joi from 'joi';

const signupAuthenticationOTPSchema = Joi.alternatives().try(
  Joi.object({
    OTP: Joi.string().length(6).required(),
  }).length(1)
);

export default signupAuthenticationOTPSchema;
