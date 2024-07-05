// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
// import Controller from "../controllers/index.controller.js";
import SigninController from "../controllers/signin.controller.js";


const signinController = SigninController;


const signinRouter = Router();

signinRouter.route('/')
  // For check user identity with his email and password
  .post(signinController.checkUser);
  
export default signinRouter;