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
import authenticationCheck from "../middlewares/authentication-check.middleware.js";
import countryRouter from "./country.router.js";
import cityRouter from "./city.router.js";



const router = Router();

router.use('/activity', activityRouter);
router.use('/signup', signupRouter);
router.use('/signin', signinRouter);
router.use('/signout', signoutRouter);
router.use('/unsubscribe', unsubscribeRouter);
router.use( '/profil',authenticationCheck, profilRouter);
router.use('/forgot-password', forgotPasswordRouter);
router.use('/country', countryRouter);
router.use('/city', cityRouter);



// TODO : Handler error middleware here 👇
router.use((error, req, res, next) => {
  let { message, status, name, code } = error;
  console.log(status, name, message);
  console.log(error);

  switch (name) {
    case "ValidationError":
      status = 404;
      message = 'Bad request. Invalid value.'
    break;
      
    case "BadRequest":
      status = 404;
    break;
        
    default:
      status = 404;
      message = 'Bad request. Invalid value.'
    break;
  }

  switch (code) {
    case '23503':
      status = 403;
      message = 'Request forbidden. This element is attached to an other element'
      break;
  
    default:
      break;
  }


  res.status(status).json({error: message});

})

export default router;