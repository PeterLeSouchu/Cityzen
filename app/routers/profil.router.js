// TIERCE MODULES
import { Router } from 'express';

// EXTERNAL MODULES
import profilController from '../controllers/profil.controller.js';
import catchHandlerController from '../middlewares/error-handler.middleware.js';
import validationSchema from '../schema-validations/validation.schema.js';
import profilFavoritePostSchema from '../schema-validations/profil/profil-favorite-post.schema.js';
import profilFavoriteDeleteSchema from '../schema-validations/profil/profil-favorite-delete.schema.js';
import profilActivityPostSchema from '../schema-validations/profil/profil-activity-post.schema.js';
import profilActivityDeleteSchema from '../schema-validations/profil/profil-activity-delete.schema.js';
import profilRatingPostSchema from '../schema-validations/profil/profil-rating-post.schema.js';
import profilActivityPatchSchema from '../schema-validations/profil/profil-activity-patch.schema.js';
import paramsSchema from '../schema-validations/params.schema.js';
import updateSchema from '../schema-validations/update.schema.js';
import profilRatingPatchSchema from '../schema-validations/profil/profil-rating-patch.schema.js';
import upload from '../middlewares/multer.upload.middlewares.js';
import { doubleCsrfProtection } from "../config/csrf.config.js";


const profilRouter = Router();

profilRouter.route('/pseudo');
// .patch(profilController.update);

profilRouter.route('/authentication');
// .patch(profilController.update);

// To handle favorites of the user
profilRouter
  .route('/favorite')
  .get(catchHandlerController(profilController.favorites.index))
  .post(doubleCsrfProtection,
    validationSchema(profilFavoritePostSchema, 'body'),
    catchHandlerController(profilController.favorites.store)
  );

profilRouter
  .route('/favorite/:id(\\d+)')
  .delete(doubleCsrfProtection, 
    validationSchema(profilFavoriteDeleteSchema, 'params', undefined, true),
    catchHandlerController(profilController.favorites.destroy)
  );

// To handle created activities of the user
profilRouter
  .route('/activity')
  .get(catchHandlerController(profilController.activities.index))
  .post(doubleCsrfProtection, 
    (req, res, next) => {
      console.log(req.body);
      next();
    },
    validationSchema(profilActivityPostSchema, 'body'),
    upload.single('image'),
    catchHandlerController(profilController.activities.store)
  );

profilRouter
  .route('/activity/:id(\\d+)')
  .patch(doubleCsrfProtection, 
    validationSchema(
      updateSchema(paramsSchema, profilActivityPatchSchema),
      undefined,
      'update',
      true
    ),
    catchHandlerController(profilController.activities.update)
  )
  .delete(doubleCsrfProtection, 
    validationSchema(profilActivityDeleteSchema, 'params', undefined, true),
    catchHandlerController(profilController.activities.destroy)
  );

// To handle rating activities of the user
profilRouter
  .route('/rating')
  .get(catchHandlerController(profilController.ratings.index));

profilRouter
  .route('/rating/:id(\\d+)') // id refers to an activity
  .get(catchHandlerController(profilController.ratings.show))
  .patch(doubleCsrfProtection, 
    validationSchema(
      updateSchema(paramsSchema, profilRatingPatchSchema),
      undefined,
      'update',
      true
    ),
    catchHandlerController(profilController.ratings.update)
  )
  .post(doubleCsrfProtection, 
    validationSchema(profilRatingPostSchema, 'body'),
    catchHandlerController(profilController.ratings.store)
  );

export default profilRouter;

/*
  .get(favoriteController.index)
  .post(favoriteController.store)
  .delete(favoriteController.destroy);
 */
