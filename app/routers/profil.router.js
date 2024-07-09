// TIERCE MODULES
import { Router } from "express";

// EXTERNAL MODULES
import profilController from "../controllers/profil.controller.js";
import catchHandlerController from "../errors/api.error.js";



const profilRouter = Router();

profilRouter.route('/pseudo')
// Check with the JWT and the id from session and change pseudo in DB (use middleware to check user)
  // .patch(profilController.update);

profilRouter.route('/authentication')
// Check with the JWT, the id from session and check password from DB. If correct change new password in DB (use middleware to check user)
  // .patch(profilController.update);

  // To handle favorites of the user
profilRouter.route('/favorite')
  .get(catchHandlerController(profilController.favorites.index)) // OK !
  .post(catchHandlerController(profilController.favorites.store)) // OK !

profilRouter.route('/favorite/:id(\\d+)')
  .delete(catchHandlerController(profilController.favorites.destroy)); // OK !

  // To handle created activities of the user
profilRouter.route('/activity')
  // .get(profilController.index) // retourner toutes les activités crées par le user
  // .post(profilController.store) // crée une activité par le user
 
  profilRouter.route('/activity/:id(\\d+)')
  // .patch(profilController.update)  // modifier une activité crée par le user
  // .delete(profilController.destroy); // supprimer une activité créée par le user

profilRouter.route('/raiting')
  // .get(profilController.rating.index)  // retourne toutes les activités notées (inclure une note moyenne totale)
  // .post(profilController.rating.store)  // ajouter une note à une activité

// profilRouter.route('/raiting/:id(\\d+)')
  // .get




export default profilRouter;

/*
  .get(favoriteController.index)
  .post(favoriteController.store)
  .delete(favoriteController.destroy);
 */