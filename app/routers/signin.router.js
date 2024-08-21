// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import signinController from "../controllers/signin.controller.js";


const signinRouter = Router();

signinRouter.route('/')
  // For check user identity with his email and password
  .post(signinController.login);
  
export default signinRouter;