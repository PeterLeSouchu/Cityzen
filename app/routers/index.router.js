// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import activityRouter from "./activity.router.js";
import signinRouter from "./signin.router.js";
import signoutRouter from "./signout.router.js";
import unsubscribeRouter from "./unsubscribe.router.js";
import profilRouter from "./profil.router.js";



const router = Router();

router.use('/activity', activityRouter);
router.use('/signin', signinRouter);
router.use('/signout', signoutRouter);
router.use('/unsubscribe', unsubscribeRouter);
router.use('/profil', profilRouter);


// TODO : Handler error middleware here 👇

export default router;