import { Router } from "express";
import activitiesController from "../controllers/activities.controller.js";

// import validationMiddleware from '../../middlewares/validation.middleware.js';

const activityRouter = Router();

// for connected user
activityRouter.route('/')
  .post(activitiesController.store);

// Route pour obtenir les activités récentes
activityRouter.route('/recent')
  .get(activitiesController.showRecent);

activityRouter.route('/rating')
  .get(activitiesController.showRating);

// Route pour obtenir les activités d'une ville et d'un pays spécifiques
activityRouter.route('/:country/:city')
  .get(activitiesController.index);

// Route pour obtenir une activité par son ID
activityRouter.route('/:id')
  .get(activitiesController.show);

export default activityRouter;
