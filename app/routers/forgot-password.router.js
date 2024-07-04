// TIERCE MODULES
import { Router } from "express";


// forgotPasswordController has a class which extends the Controller to add more method because it has additional methods.
const forgotPasswordController = {forgotPasswordController: 'to do'};

const forgotPasswordRouter = Router();

forgotPasswordRouter.route('/')
// Send an OTP by email (receive the email in the body). POST because we recive the email from the body
  // .post(forgotPasswordController.sendOTP);

forgotPasswordRouter.route('/confirmation')
// Check the OTP and update the password in DB. POST because we recive the OTP from the body
  // .post(forgotPasswordController.checkUser);

forgotPasswordRouter.route('/authentication')
// Change the password of the user
  // .post(forgotPasswordController.update);


export default forgotPasswordRouter;
