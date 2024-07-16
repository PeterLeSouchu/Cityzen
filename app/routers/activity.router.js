import { Router } from "express";
import activityController from "../controllers/activity.controller.js";
import catchHandlerController from "../middlewares/error-handler.middleware.js";

// import validationMiddleware from '../../middlewares/validation.middleware.js';

const activityRouter = Router();

// Route pour obtenir les activités récentes
activityRouter.route('/recent')
  .get(
    catchHandlerController(activityController.showRecent)
  );

activityRouter.route('/rating')
  .get(
    catchHandlerController(activityController.showRating)
  );

// Route pour obtenir les activités d'une ville et d'un pays spécifiques
activityRouter.route('/:country/:city')
  .get(
    catchHandlerController(activityController.index)
  );

// Route pour obtenir une activité par son ID
activityRouter.route('/:id')
  .get(
    catchHandlerController(activityController.show)
  );

export default activityRouter;