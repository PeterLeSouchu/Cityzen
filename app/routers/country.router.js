import { Router } from "express";
import countryController from "../controllers/country.controller.js";

// import validationMiddleware from '../../middlewares/validation.middleware.js';

const countryRouter = Router();

countryRouter.route('/:country')
  .get(countryController.index);

export default countryRouter;
