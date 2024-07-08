// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import activityRouter from "./activity.router.js";
import signinRouter from "./signin.router.js";
import signoutRouter from "./signout.router.js";
import unsubscribeRouter from "./unsubscribe.router.js";
import profilRouter from "./profil.router.js";
import forgotPasswordRouter from "./forgot-password.router.js";
import signupRouter from "./signup.router.js";
import authenticationCheck from "../middlewares/authenticationCheck.js";



const router = Router();

router.use('/activity', activityRouter);
router.use('/signup', signupRouter);
router.use('/signin', signinRouter);
router.use('/signout', signoutRouter);
router.use('/unsubscribe', unsubscribeRouter);
router.use( '/profil',authenticationCheck, profilRouter);
router.use('/forgot-password', forgotPasswordRouter);



// TODO : Handler error middleware here 👇

export default router;