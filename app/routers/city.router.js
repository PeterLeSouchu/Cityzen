import { Router } from "express";
import cityController from "../controllers/city.controller.js";

// import validationMiddleware from '../../middlewares/validation.middleware.js';

const cityRouter = Router();

cityRouter.route('/:city')
  .get(cityController.index);

export default cityRouter;
