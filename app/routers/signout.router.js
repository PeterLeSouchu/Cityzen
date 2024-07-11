// TIERCE MODULES
import { Router } from 'express';
import signoutController from '../controllers/signout.controller.js';

// SignoutController has its own class because it has additional methods and has not need do data from DB. So now we dont use a Singleton for the moment (maybe after)
// const signoutController = { signoutController: 'to do' };

const signoutRouter = Router();

signoutRouter.route('/').post(signoutController.index);
// For disconnect the user and remove the session and destroy the JWT
// .post(signoutController.disconnect);

export default signoutRouter;
