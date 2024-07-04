// TIERCE MODULES
import { Router } from "express";


// profilController has a class which extends the Controller to add more method because it has additional methods.
const profilController = new profilController({datamapper: 'to do'});

const profilRouter = Router();

profilRouter.route('/pseudo')
// Check with the JWT and the id from session and change pseudo in DB (use middleware to check user)
  .patch(profilController.update);

profilRouter.route('/authentication')
// Check with the JWT, the id from session and check password from DB. If correct change new password in DB (use middleware to check user)
  .patch(profilController.update);

profilRouter.route('/favorite')
  .get(profilController.index)
  .post(profilController.store)
  .delete(profilController.destroy);

profilRouter.route('/activity')
  .get(profilController.index)
  .post(profilController.store)
  .patch(profilController.update)
  .delete(profilController.destroy);


export default profilRouter;

/*
  .get(favoriteController.index)
  .post(favoriteController.store)
  .delete(favoriteController.destroy);
 */