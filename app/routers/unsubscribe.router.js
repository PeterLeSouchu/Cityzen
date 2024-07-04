// TIERCE MODULES
import { Router } from "express";


// unsubscribeController has its own class because it has additional methods.
const unsubscribeController = {unsubscribeController: 'to do'};

const unsubscribeRouter = Router();

unsubscribeRouter.route('/')
// To send OTP code (OTP stocked in the session)
// .post(unsubscribeController.sendOTP);

unsubscribeRouter.route('/confirmation')
// For check the user and remove the user in the DB if the code is correct
  // .post(unsubscribeController.checkUser);
  
export default unsubscribeRouter;