import Joi from "joi";

const PASSWORD_REGEX = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$');

const signupAuthenticationSchema = Joi.alternatives()
  .try(
    Joi.object({
    email: Joi.string()
      .email()
      .required(),

    password: Joi.string()
    .pattern(PASSWORD_REGEX)
    .required(),

    OTP: Joi.string()
    .length(6)
    .required()
    })
    .length(3),

    Joi.object({
    email: Joi.string()
      .email()
      .required(),

    password: Joi.string()
    .pattern(PASSWORD_REGEX)
    .required(), 
    })
    .length(2)
  ) 

  // const signupAuthenticationSchema = Joi.object({
//   email: Joi.string()
//     .email()
//     .required(),

//    password: Joi.string()
//    .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'))
//    .required(), 

//    OTP: Joi.string()
//    .length(6)
//   //  [A-Z]+|[a-z]+|[0-9]+|[#?!@$ %^&*-]+
//     // .pattern()
// })
// .min(2)
// .max(3)
// .and('email', 'password')
// ;


export default signupAuthenticationSchema;
