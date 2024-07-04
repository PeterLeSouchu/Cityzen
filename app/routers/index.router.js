// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import activityRouter from "./activity.router.js";
import favoriteRouter from "./favorite.router.js";



const router = Router();

router.use('/activity', activityRouter);
router.use('/favorite', favoriteRouter);

// TODO : Handler error middleware here 👇

export default router;