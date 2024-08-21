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
// import { doubleCsrfProtection } from '../config/csrf.config.js';
import uploadErrorHandler from '../middlewares/upload-files.middleware.js';
import setImageInBody from '../utils/set-image.js';
import profilPasswordUpdatePatchSchema from '../schema-validations/profil/profil-passwordUpdate-patch.schema.js';
import checkFile from '../middlewares/check-file.middleware.js';
import { csrfSynchronisedProtection } from '../config/csrf.config.js';

const profilRouter = Router();

profilRouter.route('/pseudo').patch(
  (req, res, next) => {
    console.log(req.cookies);
    next();
  },
  csrfSynchronisedProtection,
  catchHandlerController(profilController.account.updatePseudo)
);

profilRouter.route('/updatePassword').patch(
  (req, res, next) => {
    console.log(req.cookies);
    next();
  },
  csrfSynchronisedProtection,
  validationSchema(profilPasswordUpdatePatchSchema, 'body', undefined, false),
  catchHandlerController(profilController.account.updatePassword)
);

profilRouter.route('/unsubscribe').post(
  (req, res, next) => {
    console.log(req.cookies);
    next();
  },
  csrfSynchronisedProtection,
  catchHandlerController(profilController.account.delete)
);

profilRouter.route('/authentication');
// .patch(profilController.update);

// To handle favorites of the user
profilRouter
  .route('/favorite')

  /**
    * GET /profil/favorite
    * @summary Get all favorite from a profil user
    * @tags Profil-Favorite
    * @return {WrapperFavorite} 200 - Success response - application/json
    * @return {ApiError} 403 - Forbidden response - application/json
    * @example response - 200 - example success response
    {
      "data": [
        {
          "id_favorite": 11,
          "id_user": 2,
          "id_activity": 17,
          "created_at_favorite": "2024-07-17T09:50:06.217Z",
          "updated_at_favorite": null,
          "slug": "l-escargot-paris-3",
          "title": "L'Escargot",
          "description": "L'Escargot",
          "url_image": "https://s3-media3.fl.yelpcdn.com/bphoto/mvTnZRX0Jn7R2pXsKYtjvA/o.jpg",
          "address": "38 rue Montorgueil",
          "phone": "+33142368351",
          "avg_rating": "3.8",
          "latitude": "48.864206",
          "longitude": "2.3467",
          "id_created_user": 1,
          "id_city": 29245,
          "created_at_activity": "2024-07-16T13:26:28.393Z",
          "updated_at_activity": null
        },
        {
          "id_favorite": 6,
          "id_user": 2,
          "id_activity": 28,
          "created_at_favorite": "2024-07-17T07:03:59.487Z",
          "updated_at_favorite": null,
          "slug": "le-café-de-la-banque-marseille-2",
          "title": "Le Café de la Banque",
          "description": "Le Café de la Banque",
          "url_image": "https://s3-media1.fl.yelpcdn.com/bphoto/E3NFZzFwHULvA1wsNo9m9w/o.jpg",
          "address": "24 bd Paul Peytral",
          "phone": "+33491333507",
          "avg_rating": "4.4",
          "latitude": "43.29022",
          "longitude": "5.37866",
          "id_created_user": 1,
          "id_city": 4343,
          "created_at_activity": "2024-07-16T13:26:41.697Z",
          "updated_at_activity": null
        },
        {
          "id_favorite": 5,
          "id_user": 2,
          "id_activity": 29,
          "created_at_favorite": "2024-07-17T07:03:58.482Z",
          "updated_at_favorite": null,
          "slug": "treize-en-vue-marseille",
          "title": "Treize en Vue",
          "description": "Treize en Vue",
          "url_image": "https://s3-media4.fl.yelpcdn.com/bphoto/PMrAoCLDdUuB0en8giWIyw/o.jpg",
          "address": "40 rue de Breteuil",
          "phone": "+33491482128",
          "avg_rating": "4.6",
          "latitude": "43.28937",
          "longitude": "5.37619",
          "id_created_user": 1,
          "id_city": 4343,
          "created_at_activity": "2024-07-16T13:26:41.699Z",
          "updated_at_activity": null
        },
        {
          "id_favorite": 4,
          "id_user": 2,
          "id_activity": 30,
          "created_at_favorite": "2024-07-17T07:03:56.924Z",
          "updated_at_favorite": null,
          "slug": "sauveur-marseille",
          "title": "Sauveur",
          "description": "Sauveur",
          "url_image": "https://s3-media2.fl.yelpcdn.com/bphoto/h1J_sFKYsxYj0Wix0J1AHQ/o.jpg",
          "address": "10 rue d'Aubagne",
          "phone": "+33491543396",
          "avg_rating": "4.4",
          "latitude": "43.295589",
          "longitude": "5.379063",
          "id_created_user": 1,
          "id_city": 4343,
          "created_at_activity": "2024-07-16T13:26:41.701Z",
          "updated_at_activity": null
        }
      ]
    }
    * @example response - 403 - example 403 response
    {
     "error": "Forbidden. You need to be connected to access this route"
    }
   */
  .get(catchHandlerController(profilController.favorites.index))

  /**
    * POST /profil/favorite
    * @summary Save one activity in user favorites
    * @tags Profil-Favorite
    * @param {PostFavorite} request.body.required - Favorite infos
    * @return {WrapperFavorite} 201 - Success response - application/json
    * @return {ApiError} 400 - Bad request response - application/json
    * @return {ApiError} 404 - Order not found - application/json
    * @return {ApiError} 403 - Forbidden response - application/json
    * @example request - example payload
    {
      "id": 17
    }
    * @example response - 201 - example success response
    {
      "data": [
         {
          "id": 4,
          "id_user": 1,
          "id_activity": 30,
          "created_at": "2024-07-16T13:26:41.701Z",
          "updated_at": null,
          "slug": "sauveur-marseille",
          "title": "Sauveur",
          "description": "Sauveur",
          "url_image": "https://s3-media2.fl.yelpcdn.com/bphoto/h1J_sFKYsxYj0Wix0J1AHQ/o.jpg",
          "address": "10 rue d'Aubagne",
          "phone": "+33491543396",
          "avg_rating": "4.4",
          "latitude": "43.295589",
          "longitude": "5.379063",
          "id_city": 4343
       }
     ]
    }
    * @example response - 400 - example 400 response
    {
     "error": "Bad request. Invalid value"
    }
    * @example response - 404 - example 404 response
    {
     "error": "Bad request. Not found"
    }
    * @example response - 403 - example 403 response
    {
     "error": "Forbidden. You need to be connected to access this route"
    }
   */
  .post(
    // doubleCsrfProtection,
    validationSchema(profilFavoritePostSchema, 'body'),
    catchHandlerController(profilController.favorites.store)
  );

profilRouter
  .route('/favorite/:id(\\d+)')

  /**
    * DELETE profil/favorite/{id}
    * @summary Delete one favorite from user favorites
    * @tags Profil-Favorite
    * @param {number} id.path.required
    * @return {WrapperFavorite} 200 - Success response - application/json
    * @return {ApiError} 400 - Bad request. Invalid value - application/json
    * @return {ApiError} 404 - Bad request. Not found - application/json
    * @return {ApiError} 403 - Forbidden response - application/json
    * @example response - 200 - example success response
    {
      "data": [
        {
          "id": 30,
          "id_user": 1,
          "id_activity": 30,
          "created_at": "2024-07-16T13:26:41.701Z",
          "updated_at": null,
          "slug": "sauveur-marseille",
          "title": "Sauveur",
          "description": "Sauveur",
          "url_image": "https://s3-media2.fl.yelpcdn.com/bphoto/h1J_sFKYsxYj0Wix0J1AHQ/o.jpg",
          "address": "10 rue d'Aubagne",
          "phone": "+33491543396",
          "avg_rating": "4.4",
          "latitude": "43.295589",
          "longitude": "5.379063",
          "id_city": 4343
       }
     ]
    }
    * @example response - 400 - example 400 response
    {
     "error": "Bad request. Invalid value"
    }
    * @example response - 404 - example 404 response
    {
     "error": "Bad request. Not found"
    }
    * @example response - 403 - example 403 response
    {
     "error": "Forbidden. You need to be connected to access this route"
    }
   */
  .delete(
    // doubleCsrfProtection,
    validationSchema(profilFavoriteDeleteSchema, 'params', undefined, true),
    catchHandlerController(profilController.favorites.destroy)
  );

// To handle created activities of the user
profilRouter
  .route('/activity')

  /**
    * GET /profil/activity
    * @summary Get all created activities from a profil user
    * @tags Profil-Activity
    * @return {WrapperActivity} 200 - Success response - application/json
    * @return {ApiError} 403 - Forbidden response - application/json
    * @example response - 200 - example success response
    {
       "data": [
         {
           "id": 37,
           "slug": "blabla%20aulnay-sous-bois",
           "title": "blabla",
           "description": "blabla",
           "url_image": "http://localhost:3000/uploads/1721206609547_Capture d'Ã©cran 2024-01-26130504.png",
           "address": "103 chemin du moulin de la ville",
           "phone": "0629685293",
           "avg_rating": null,
           "latitude": "48.8894243",
           "longitude": "2.3463342",
           "id_user": 2,
           "id_city": 34538,
           "created_at": "2024-07-17T08:56:16.250Z",
           "updated_at": "2024-07-17T08:58:01.931Z"
        }
      ]
    }
    * @example response - 403 - example 403 response
    {
     "error": "Forbidden. You need to be connected to access this route"
    }
  */
  .get(catchHandlerController(profilController.activities.index))

  /**
    * POST /profil/activity
    * @summary Create and save an activity
    * @tags Profil-Activity
    * @param {PostActivity} request.body.required - Activity infos
    * @return {WrapperActivity} 201 - Success response - application/json
    * @return {ApiError} 400 - Bad request. Invalid value - application/json
    * @return {ApiError} 403 - Forbidden response - application/json
    * @example request - example payload
    {
       "title": "kermesse d'hiver",
       "description": "Une kermesse prévu pour la date du 01/12/2024",
       "image": "",
       "address": "103 chemin du moulin de la  ville",
       "phone": "0624875896",
       "city": "Aulnay-sous-Bois"
    } 
    * @example response - 201 - example success response
    {
       "data": [
         {
           "id": 38,
           "slug": "kermesse%20d'hiver%20",
           "title": "Kermesse d'hiver",
           "description": "Une kermesse prévu pour la date du 01/12/2024",
           "url_image": "http://localhost:3000/uploads/1721215792296_Capture d'Ã©cran 2024-01-26130504.png",
           "address": "103 chemin du moulin de la ville",
           "phone": "0624875896",
           "avg_rating": null,
           "latitude": "48.8894243",
           "longitude": "2.3463342",
           "id_user": 2,
           "id_city": 34538,
           "created_at": "2024-07-17T08:56:16.250Z",
           "updated_at": "null"
        }
      ]
    }
    * @example response - 400 - example 400 response
    {
     "error": "Bad request. Invalid value"
    }
    * @example response - 404 - example 404 response
    {
     "error": "Bad request. Not found"
    }
    * @example response - 403 - example 403 response
    {
     "error": "Forbidden. You need to be connected to access this route"
    }
  */
  .post(
    csrfSynchronisedProtection,
    upload.single('image'),
    uploadErrorHandler,
    checkFile,
    (req, res, next) => {
      console.log('req.body', req.body, req.file, req.session);
      next();
    },
    validationSchema(profilActivityPostSchema, 'body'),
    catchHandlerController(profilController.activities.store)
  );

profilRouter
  .route('/activity/:id(\\d+)')

  /**
    * PATCH /profil/activity/{id}
    * @summary Update an activity
    * @tags Profil-Activity
    * @param {number} id.path.required - Activity ID to be updated
    * @param {PatchActivity} request.body.required - Activity infos
    * @return {WrapperActivity} 200 - Success response - application/json
    * @return {ApiError} 400 - Bad request. Invalid value - application/json
    * @return {ApiError} 404 - Bad request. Not found - application/json
    * @return {ApiError} 403 - Forbidden response - application/json
    * @example request - update title
    {
       "title": "Le bleu top"
    }
    * @example request - update image, address, phone and city
    {
      "image": "http://cityzen.fr/upload/fnikrefvnipndxpmpi",
      "address": "rue du Ruby",
      "phone": "0657847596",
      "city": "Marseille"
    }
    * @example response - 200 - example success response
    {
      "data": [
        {
         "id": 38,
         "slug": "le%20bleu%20top%20aulnay-sous-bois",
         "title": "Le bleu top",
         "description": "Une bonne bleu",
         "url_image": "http://localhost:3000/uploads/1721215792296_Capture d'Ã©cran 2024-01-26130504.png",
         "address": "103 chemin du moulin de la ville",
         "phone": "0624875896",
         "avg_rating": null,
         "latitude": "48.9519058",
         "longitude": "2.500601",
         "id_user": 2,
         "id_city": 34538,
         "created_at": "2024-07-17T11:29:52.840Z",
         "updated_at": "2024-07-17T11:50:12.801Z"
        }
      ]
    }
    * @example response - 400 - example 400 response
    {
      "error": "Bad request. Invalid value"
    }
    * @example response - 404 - example 404 response
    {
      "error": "Bad request. Not found"
    }
    * @example response - 403 - example 403 response
    {
     "error": "Forbidden. You need to be connected to access this route"
    }
  */
  .patch(
    csrfSynchronisedProtection,
    upload.single('image'),
    checkFile,
    setImageInBody,
    validationSchema(
      updateSchema(paramsSchema, profilActivityPatchSchema),
      undefined,
      'update',
      true
    ),
    catchHandlerController(profilController.activities.update)
  )

  /**
    * DELETE profil/activity/{id}
    * @summary Delete one activity by the user
    * @tags Profil-Activity
    * @param {number} id.path.required
    * @return {WrapperActivity} 200 - Success response - application/json
    * @return {ApiError} 400 - Bad request. Invalid value - application/json
    * @return {ApiError} 404 - Bad request. Not found - application/json
    * @return {ApiError} 403 - Forbidden response - application/json
    * @example response - 200 - example success response
    {
      "data": [
        {
          "id": 30,
          "id_user": 1,
          "id_activity": 30,
          "created_at": "2024-07-16T13:26:41.701Z",
          "updated_at": null,
          "slug": "sauveur-marseille",
          "title": "Sauveur",
          "description": "Sauveur",
          "url_image": "https://s3-media2.fl.yelpcdn.com/bphoto/h1J_sFKYsxYj0Wix0J1AHQ/o.jpg",
          "address": "10 rue d'Aubagne",
          "phone": "+33491543396",
          "avg_rating": "4.4",
          "latitude": "43.295589",
          "longitude": "5.379063",
          "id_city": 4343
       }
     ]
    }
    * @example response - 400 - example 400 response
    {
     "error": "Bad request. Invalid value"
    }
    * @example response - 404 - example 404 response
    {
     "error": "Bad request. Not found"
    }
    * @example response - 403 - example 403 response
    {
     "error": "Forbidden. You need to be connected to access this route"
    }
   */
  .delete(
    csrfSynchronisedProtection,
    validationSchema(profilActivityDeleteSchema, 'params', undefined, true),
    catchHandlerController(profilController.activities.destroy)
  );

// To handle rating activities of the user
profilRouter
  .route('/rating')

  /**
    * GET /profil/rating
    * @summary Get all user activities rating
    * @tags Profil-Rating
    * @return {WrapperRaitingAllActivities} 200 - Success response - application/json
    * @return {ApiError} 403 - Forbidden response - application/json
    * @example response - 200 - example success response
    {
      "data": [
        {
          "id_user_rating": 1,
          "id_user": 2,
          "id_activity": 20,
          "id_rating": 2,
          "created_at_rating": "2024-07-17T12:37:40.166Z",
          "updated_at_rating": null,
          "slug": "la-fontaine-de-mars-paris-2",
          "title": "La Fontaine de Mars",
          "description": "La Fontaine de Mars",
          "url_image": "https://s3-media3.fl.yelpcdn.com/bphoto/uI4ifexZBDt-tW1Im7B_8w/o.jpg",
          "address": "129 rue Saint-Dominique",
          "phone": "+33147054644",
          "avg_rating": "4.4",
          "latitude": "48.858394",
          "longitude": "2.302568",
          "id_created_user": 1,
          "id_city": 29245,
          "created_at_activity": "2024-07-16T13:26:28.398Z",
          "updated_at_activity": null
        }
      ],
      "avgRating": "2.0000000000000000"
    }
    * @example response - 403 - example 403 response
    {
     "error": "Forbidden. You need to be connected to access this route"
    }
  */
  .get(catchHandlerController(profilController.ratings.index));

profilRouter
  .route('/rating/:id(\\d+)') // id refers to an activity

  /**
    * GET /profil/rating/{id}
    * @summary Get all user activities rating
    * @tags Profil-Rating
    * @param {number} id.path.required
    * @return {WrapperRaitingActivity} 200 - Success response - application/json
    * @return {ApiError} 403 - Forbidden response - application/json
    * @example response - 200 - example success response
    {
          "data": [
       {
       "id": 1,
       "id_user": 2,
       "id_activity": 20,
       "id_rating": 4,
       "created_at": "2024-07-16T13:26:28.398Z",
       "updated_at": null
       } 
     ]
    }
    * @example response - 403 - example 403 response
    {
     "error": "Forbidden. You need to be connected to access this route"
    }
  */
  .get(catchHandlerController(profilController.ratings.show))

  /**
    * PATCH /profil/rating/{id}
    * @summary Update a rating
    * @tags Profil-Rating
    * @param {number} id.path.required - Activity ID to be updated
    * @param {PatchRating} request.body.required - Activity infos
    * @return {WrapperRaiting} 200 - Success response - application/json
    * @return {ApiError} 400 - Bad request. Invalid value - application/json
    * @return {ApiError} 404 - Bad request. Not found - application/json
    * @return {ApiError} 403 - Forbidden response - application/json
    * @example request - update title
    * {
    *   "rating": 2
    * }
    * @example response - 200 - example success response
    {
      "data": [
        {
         "id": 1,
         "id_user": 2,
         "id_activity": 20,
         "id_rating": 4,
         "created_at": "2024-07-17T12:37:40.166Z",
         "updated_at": null
        }
      ]
    }
    * @example response - 400 - example 400 response
    {
      "error": "Bad request. Invalid value"
    }
    * @example response - 404 - example 404 response
    {
      "error": "Bad request. Not found"
    }
    * @example response - 403 - example 403 response
    {
     "error": "Forbidden. You need to be connected to access this route"
    }
   */
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

  /**
    * POST /profil/rating/{id}
    * @summary Save a rating
    * @tags Profil-Rating
    * @param {number} id.path.required - Activity ID to be updated
    * @param {PostRating} request.body.required - Activity infos
    * @return {WrapperRaiting} 200 - Success response - application/json
    * @return {ApiError} 400 - Bad request. Invalid value - application/json
    * @return {ApiError} 404 - Bad request. Not found - application/json
    * @return {ApiError} 403 - Forbidden response - application/json
    * @example request - update title
    * {
    *   "rating": 4
    * }
    * @example response - 200 - example success response
    {
      "data": [
        {
          "id": 2,
          "id_user": 2,
          "id_activity": 9,
          "id_rating": 4,
          "created_at": "2024-07-18T08:14:55.461Z",
          "updated_at": null
        }
      ]
    }
    * @example response - 400 - example 400 response
    {
      "error": "Bad request. Invalid value"
    }
    * @example response - 404 - example 404 response
    {
      "error": "Bad request. Not found"
    }
    * @example response - 403 - example 403 response
    {
     "error": "Forbidden. You need to be connected to access this route"
    }
   */
  .post(
    // doubleCsrfProtection,
    validationSchema(profilRatingPostSchema, 'body'),
    catchHandlerController(profilController.ratings.store)
  );

export default profilRouter;
