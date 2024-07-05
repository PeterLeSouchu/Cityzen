// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import signupController from "../controllers/signup.controller.js";

const signupRouter = Router();

signupRouter.route('/')
  // For check user identity with his email and password
  .post(signupController.sendOTP)
  .post(signupController.checkUserByOTP);
  
export default signupRouter;