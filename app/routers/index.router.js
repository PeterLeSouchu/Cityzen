// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import activityRouter from "./activity.router.js";



const router = Router();

router.use('/activity', activityRouter);

// TODO : Handler error middleware here 👇

export default router;