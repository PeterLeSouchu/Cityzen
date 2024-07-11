// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import profilController from "../controllers/profil.controller.js";
import catchHandlerController from "../middlewares/error-handler.middleware.js";
import validationSchema from "../schema-validations/validation.schema.js";
import profilFavoritePostSchema from "../schema-validations/profil/profil-favorite-post.schema.js";
import profilFavoriteDeleteSchema from "../schema-validations/profil/profil-favorite-delete.schema.js";
import profilActivityPostSchema from "../schema-validations/profil/profil-activity-post.schema.js";
import profilActivityDeleteSchema from "../schema-validations/profil/profil-activity-delete.schema.js";
import profilRatingPostSchema from "../schema-validations/profil/profil-rating-post.schema.js";
import profilActivityPatchSchema from "../schema-validations/profil/profil-activity-patch.schema.js";
import paramsSchema from "../schema-validations/params.schema.js";
import updateSchema from "../schema-validations/update.schema.js";



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
  .delete(validationSchema(profilFavoriteDeleteSchema, 'params', true), catchHandlerController(profilController.favorites.destroy));

  // To handle created activities of the user
profilRouter.route('/activity')
  .get(catchHandlerController(profilController.activities.index)) // OK
  .post(validationSchema(profilActivityPostSchema, 'body'), catchHandlerController(profilController.activities.store))
 
  profilRouter.route('/activity/:id(\\d+)')
  .patch(validationSchema(updateSchema(paramsSchema, profilActivityPatchSchema), undefined, 'update', true), catchHandlerController(profilController.activities.update))  // Validation à faire
  .delete(validationSchema(profilActivityDeleteSchema, 'params', true), catchHandlerController(profilController.activities.destroy));

profilRouter.route('/rating')
  .get(catchHandlerController(profilController.ratings.index))

profilRouter.route('/rating/:id(\\d+)') // id fait référence à une activité
  .get(catchHandlerController(profilController.ratings.getOne))
  .patch(catchHandlerController(profilController.ratings.update))
  .post(validationSchema(profilRatingPostSchema, 'body'), catchHandlerController(profilController.ratings.store))

  // Retrouver la note selon l'utilisateur et l'activité pour l'afficher lors du clique sur l'activité





export default profilRouter;

/*
  .get(favoriteController.index)
  .post(favoriteController.store)
  .delete(favoriteController.destroy);
 */