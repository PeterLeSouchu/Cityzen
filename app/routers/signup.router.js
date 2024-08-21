// TIERCE MODULES
import { Router } from 'express';

// EXTERNAL MODULES
import signupController from '../controllers/signup.controller.js';
import validationSchema from '../schema-validations/validation.schema.js';
import signupAuthenticationSchema from '../schema-validations/signup/signup.authentication.schema.js';
import signupAuthenticationOTPSchema from '../schema-validations/signup/signup.authentification.OTP.schema.js';
import catchHandlerController from '../middlewares/error-handler.middleware.js';

const signupRouter = Router();

signupRouter
  .route('/')
  // For check user identity with his email and password we send an OTP code by email
  .post(
    validationSchema(signupAuthenticationSchema, 'body', undefined, false),
    catchHandlerController(signupController.sendOTP)
  );

signupRouter
  .route('/confirmation')
  // For check the received OTP code and signup the user in DB if ok
  .post(
    validationSchema(signupAuthenticationOTPSchema, 'body', undefined, false),
    catchHandlerController(signupController.checkUserByOTP)
  );

export default signupRouter;
