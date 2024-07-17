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
import upload from '../config/multer.upload.middlewares.js';
import { doubleCsrfProtection } from "../config/csrf.config.js";
import uploadErrorHandler from '../middlewares/upload-files.middleware.js';
import setImageInBody from '../utils/set-image.js';


const profilRouter = Router();

profilRouter.route('/pseudo');
// .patch(profilController.update);

profilRouter.route('/authentication');
// .patch(profilController.update);

// To handle favorites of the user
profilRouter
  .route('/favorite')
    /**
    * GET /profil/favorite
    * @summary Get all favorite from a profil user
    * @tags Favorite
    * @return {array<GetOrder>} 200 - Success response - application/json
    * @example response - 200 - example success response
    *{
    *    "data": [
    *    {
    *      "id": 28,
    *      "id_user": 1,
    *      "id_activity": 28,
    *      "created_at": "2024-07-16T13:26:41.697Z",
    *      "updated_at": null,
    *      "slug": "le-café-de-la-banque-marseille-2",
    *      "title": "Le Café de la Banque",
    *      "description": "Le Café de la Banque",
    *      "url_image": "https://s3-media1.fl.yelpcdn.com/bphoto/E3NFZzFwHULvA1wsNo9m9w/o.jpg",
    *      "address": "24 bd Paul Peytral",
    *      "phone": "+33491333507",
    *      "avg_rating": "4.4",
    *      "latitude": "43.29022",
    *      "longitude": "5.37866",
    *      "id_city": 4343
    *    },
    *    {
    *      "id": 29,
    *      "id_user": 1,
    *      "id_activity": 29,
    *      "created_at": "2024-07-16T13:26:41.699Z",
    *      "updated_at": null,
    *      "slug": "treize-en-vue-marseille",
    *      "title": "Treize en Vue",
    *      "description": "Treize en Vue",
    *      "url_image": "https://s3-media4.fl.yelpcdn.    *com/bphoto/PMrAoCLDdUuB0en8giWIyw/o.jpg",
    *      "address": "40 rue de Breteuil",
    *      "phone": "+33491482128",
    *      "avg_rating": "4.6",
    *      "latitude": "43.28937",
    *      "longitude": "5.37619",
    *      "id_city": 4343
    *    },
    *    {
    *      "id": 30,
    *      "id_user": 1,
    *      "id_activity": 30,
    *      "created_at": "2024-07-16T13:26:41.701Z",
    *      "updated_at": null,
    *      "slug": "sauveur-marseille",
    *      "title": "Sauveur",
    *      "description": "Sauveur",
    *      "url_image": "https://s3-media2.fl.yelpcdn.    *com/bphoto/h1J_sFKYsxYj0Wix0J1AHQ/o.jpg",
    *      "address": "10 rue d'Aubagne",
    *      "phone": "+33491543396",
    *      "avg_rating": "4.4",
    *      "latitude": "43.295589",
    *      "longitude": "5.379063",
    *      "id_city": 4343
    *    }
    *  ]
    *}
   */
  .get(catchHandlerController(profilController.favorites.index))
  .post(
    // doubleCsrfProtection,
    validationSchema(profilFavoritePostSchema, 'body'),
    catchHandlerController(profilController.favorites.store)
  );

profilRouter
  .route('/favorite/:id(\\d+)')
  .delete(
    // doubleCsrfProtection, 
    validationSchema(profilFavoriteDeleteSchema, 'params', undefined, true),
    catchHandlerController(profilController.favorites.destroy)
  );

// To handle created activities of the user
profilRouter
  .route('/activity')
  .get(catchHandlerController(profilController.activities.index))
  .post(
    // doubleCsrfProtection,
    upload.single('image'),
    uploadErrorHandler,
    (req, res, next) => {console.log('req.body', req.body, req.file, req.session); next()},
    validationSchema(profilActivityPostSchema, 'body'),
    catchHandlerController(profilController.activities.store)
  );

profilRouter
  .route('/activity/:id(\\d+)')
  .patch(
    // doubleCsrfProtection,
    upload.single('image'),
    setImageInBody,
    validationSchema(
      updateSchema(paramsSchema, profilActivityPatchSchema),
      undefined,
      'update',
      true
    ),
    catchHandlerController(profilController.activities.update)
  )
  .delete(
    // doubleCsrfProtection, 
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
  .patch(
    // doubleCsrfProtection, 
    validationSchema(
      updateSchema(paramsSchema, profilRatingPatchSchema),
      undefined,
      'update',
      true
    ),
    catchHandlerController(profilController.ratings.update)
  )
  .post(
    // doubleCsrfProtection, 
    validationSchema(profilRatingPostSchema, 'body'),
    catchHandlerController(profilController.ratings.store)
  );

export default profilRouter;

/*
  .get(favoriteController.index)
  .post(favoriteController.store)
  .delete(favoriteController.destroy);
 */
