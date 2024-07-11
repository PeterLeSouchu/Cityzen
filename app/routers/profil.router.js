// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import profilController from "../controllers/profil.controller.js";
import catchHandlerController from "../middlewares/error-handler.middleware.js";
import validationSchema from "../schema-validations/validation.schema.js";
import profilFavoritePostSchema from "../schema-validations/profil/profil-favorite-post.schema.js";
import profilFavoriteDeleteSchema from "../schema-validations/profil/profil-favorite-delete.schema.js";



const profilRouter = Router();

profilRouter.route('/pseudo')
// Check with the JWT and the id from session and change pseudo in DB (use middleware to check user)
  // .patch(profilController.update);

profilRouter.route('/authentication')
// Check with the JWT, the id from session and check password from DB. If correct change new password in DB (use middleware to check user)
  // .patch(profilController.update);

  // To handle favorites of the user
profilRouter.route('/favorite')
  .get(catchHandlerController(profilController.favorites.index))
  .post(validationSchema(profilFavoritePostSchema, 'body'), catchHandlerController(profilController.favorites.store))

profilRouter.route('/favorite/:id(\\d+)')
  .delete(validationSchema(profilFavoriteDeleteSchema, 'params'), catchHandlerController(profilController.favorites.destroy));

  // To handle created activities of the user
profilRouter.route('/activity')
  .get(catchHandlerController(profilController.activities.index)) // OK
  .post(catchHandlerController(profilController.activities.store)) // OK
 
  profilRouter.route('/activity/:id(\\d+)')
  .patch(catchHandlerController(profilController.activities.update))  // OK
  .delete(catchHandlerController(profilController.activities.destroy)); // OK

profilRouter.route('/rating')
  .get(catchHandlerController(profilController.ratings.index))  // OK

profilRouter.route('/rating/:id(\\d+)')
  .post(catchHandlerController(profilController.ratings.store))  // OK (Retourne le résultat des 3 relations)

  // Retrouver la note selon l'utilisateur et l'activité pour l'afficher lors du clique sur l'activité





export default profilRouter;

/*
  .get(favoriteController.index)
  .post(favoriteController.store)
  .delete(favoriteController.destroy);
 */