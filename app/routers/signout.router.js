// TIERCE MODULES
import { Router } from "express";


// SignoutController has its own class because it has additional methods and has not need do data from DB. So now we dont use a Singleton for the moment (maybe after)
const signoutController = new signoutController();

const signoutRouter = Router();

signoutRouter.route('/')
  // For check user identity with his email and password
  .post(signoutController.store);
  
export default signoutRouter;