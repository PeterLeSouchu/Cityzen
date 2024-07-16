import { Router } from "express";
import activityController from "../controllers/activity.controller.js";

// import validationMiddleware from '../../middlewares/validation.middleware.js';

const activityRouter = Router();

// for connected user
//activityRouter.route('/')
//  .post(activityController.store);

// Route pour obtenir les activités récentes
activityRouter.route('/recent')
  .get(activityController.showRecent);

activityRouter.route('/rating')
  .get(activityController.showRating);

// Route pour obtenir les activités d'une ville et d'un pays spécifiques
activityRouter.route('/:country/:city')
  .get(activityController.index);

// Route pour obtenir une activité par son ID
activityRouter.route('/:id')
  .get(activityController.show);

export default activityRouter;