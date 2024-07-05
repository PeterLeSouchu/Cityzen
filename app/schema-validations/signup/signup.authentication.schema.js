import Joi from "joi";


const signupAuthenticationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

   password: Joi.string()
   .pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$'))
   .required() 
});

export default signupAuthenticationSchema;
