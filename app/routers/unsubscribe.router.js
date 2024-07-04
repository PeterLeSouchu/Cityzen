// TIERCE MODULES
import { Router } from "express";


// unsubscribeController has its own class because it has additional methods.
const unsubscribeController = new unsubscribeController({datamapper: 'to do'});

const unsubscribeRouter = Router();

unsubscribeRouter.route('/')
  // F  or remove the user in the DB
  .post(unsubscribeController.deleteUser);
  
export default unsubscribeRouter;