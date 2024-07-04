// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import Controller from "../controllers/index.controller.js";

// TODO : The core datamapper
const favoriteController = new Controller({datamapper: 'to do'})

const favoriteRouter = Router();

favoriteRouter.route('/')
  // Use session ID to identify the user (req.session frome express-session module)
  .get(favoriteController.index)
  .post(favoriteController.store)
  .delete(favoriteController.destroy);

export default favoriteRouter;