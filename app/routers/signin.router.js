// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import Controller from "../controllers/index.controller.js";

// TODO : Implement SigninController because he has its own class because it has additional methods. He extends the Controller class (Singleton)
const signinController = new SigninController({datamapper: 'to do'})

const signinRouter = Router();

signinRouter.route('/')
  // For check user identity with his email and password
  .post(signinController.store);
  
export default signinRouter;