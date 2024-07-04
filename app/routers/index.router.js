// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import activityRouter from "./activity.router.js";
import favoriteRouter from "./favorite.router.js";
import signinRouter from "./signin.router.js";
import signoutRouter from "./signout.router.js";



const router = Router();

router.use('/activity', activityRouter);
router.use('/favorite', favoriteRouter);
router.use('/signin', signinRouter);
router.use('/signout', signoutRouter);

// TODO : Handler error middleware here 👇

export default router;