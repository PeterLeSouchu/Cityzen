// TIERCE MODULES
import { Router } from "express";


const activityRouter = Router();

activityRouter.route('/')
  .post(activityController.store);


export default activityRouter;