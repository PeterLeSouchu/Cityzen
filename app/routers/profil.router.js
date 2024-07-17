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
    * @return {array<GetFavorite>} 200 - Success response - application/json
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

  /**
    * POST /profil/favorite
    * @summary Save one activity in user favorites
    * @tags Favorite
    * @param {PostFavorite} request.body.required - Favorite infos
    * @return {array<GetFavorite>} 201 - Success response - application/json
    * @return {ApiError} 400 - Bad request response - application/json
    * @return {ApiError} 404 - Order not found - application/json
    * @example request - example payload
    *{
    *  "id": 45,
    *} 
    * @example response - 201 - example success response
    *{
    *  "data": [
    *     {
    *      "id": 30,
    *      "id_user": 1,
    *      "id_activity": 30,
    *      "created_at": "2024-07-16T13:26:41.701Z",
    *      "updated_at": null,
    *      "slug": "sauveur-marseille",
    *      "title": "Sauveur",
    *      "description": "Sauveur",
    *      "url_image": "https://s3-media2.fl.yelpcdn.com/bphoto/h1J_sFKYsxYj0Wix0J1AHQ/o.jpg",
    *      "address": "10 rue d'Aubagne",
    *      "phone": "+33491543396",
    *      "avg_rating": "4.4",
    *      "latitude": "43.295589",
    *      "longitude": "5.379063",
    *      "id_city": 4343
    *   }
    * ]
    *}
    * @example response - 400 - example 400 response
    * {
    * "error": "Bad request. Invalid value"
    * }
    * @example response - 404 - example 404 response
    * {
    * "error": "Bad request. Not found"
    * }
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
    * @tags Favorite
    * @param {number} id.path.required
    * @return {array<GetFavorite>} 200 - Success response - application/json
    * @return {ApiError} 400 - Bad request. Invalid value - application/json
    * @return {ApiError} 404 - Bad request. Not found - application/json
    * @example response - 200 - example success response
    *{
    *  "data": [
    *    {
    *      "id": 30,
    *      "id_user": 1,
    *      "id_activity": 30,
    *      "created_at": "2024-07-16T13:26:41.701Z",
    *      "updated_at": null,
    *      "slug": "sauveur-marseille",
    *      "title": "Sauveur",
    *      "description": "Sauveur",
    *      "url_image": "https://s3-media2.fl.yelpcdn.com/bphoto/h1J_sFKYsxYj0Wix0J1AHQ/o.jpg",
    *      "address": "10 rue d'Aubagne",
    *      "phone": "+33491543396",
    *      "avg_rating": "4.4",
    *      "latitude": "43.295589",
    *      "longitude": "5.379063",
    *      "id_city": 4343
    *   }
    * ]
    *}
    * @example response - 400 - example 400 response
    * {
    * "error": "Bad request. Invalid value"
    * }
    * @example response - 404 - example 404 response
    * {
    * "error": "Bad request. Not found"
    * }
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
    * @tags Activity
    * @return {array<GetActivity>} 200 - Success response - application/json
    * @example response - 200 - example success response
    *{
    *   "data": [
    *     {
    *       "id": 37,
    *       "slug": "blabla%20aulnay-sous-bois",
    *       "title": "blabla",
    *       "description": "blabla",
    *       "url_image": "http://localhost:3000/uploads/1721206609547_Capture d'Ã©cran 2024-01-26130504.png",
    *       "address": "103 chemin du moulin de la ville",
    *       "phone": "0629685293",
    *       "avg_rating": null,
    *       "latitude": "48.8894243",
    *       "longitude": "2.3463342",
    *       "id_user": 2,
    *       "id_city": 34538,
    *       "created_at": "2024-07-17T08:56:16.250Z",
    *       "updated_at": "2024-07-17T08:58:01.931Z"
  *      }
    *  ]
    *}
  */
  .get(catchHandlerController(profilController.activities.index))

    /**
    * POST /profil/activity
    * @summary Create and save an activity
    * @tags Activity
    * @param {PostActivity} request.body.required - Activity infos
    * @return {array<GetActivity>} 201 - Success response - application/json
    * @return {ApiError} 400 - Bad request. Invalid value - application/json
    * @example request - example payload
    *{
    *   "title": "kermesse d'hiver",
    *   "description": "Une kermesse prévu pour la date du 01/12/2024",
    *   "image": "",
    *   "address": "103 chemin du moulin de la  ville",
    *   "phone": "0624875896",
    *   "city": "Aulnay-sous-Bois"
    *} 
    * @example response - 201 - example success response
    *{
    *   "data": [
    *     {
    *       "id": 38,
    *       "slug": "kermesse%20d'hiver%20",
    *       "title": "Kermesse d'hiver ",
    *       "description": "Une kermesse prévu pour la date du 01/12/2024",
    *       "url_image": "http://localhost:3000/uploads/1721215792296_Capture d'Ã©cran 2024-01-26130504.png",
    *       "address": "103 chemin du moulin de la  ville",
    *       "phone": "0624875896",
    *       "avg_rating": null,
    *       "latitude": "48.9519058",
    *       "longitude": "2.500601",
    *       "id_user": 2,
    *       "id_city": 34538,
    *       "created_at": 2024-07-17T11:29:52.840Z,
    *       "updated_at": null
    *   }
    * ]
    *}
    * @example response - 400 - example 400 response
    * {
    * "error": "Bad request. Invalid value"
    * }
    * @example response - 404 - example 404 response
    * {
    * "error": "Bad request. Not found"
    * }
   */
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

    /**
    * PATCH /profil/activity/{id}
    * @summary Update an activity
    * @tags Activity
    * @param {number} id.path.required - Activity ID to be updated
    * @param {PatchActivity} request.body.required - Activity infos
    * @return {array<GetActivity>} 200 - Success response - application/json
    * @return {ApiError} 400 - Bad request. Invalid value - application/json
    * @return {ApiError} 404 - Bad request. Not found - application/json
    * @example request - update title
    * {
    *   "title": "Le bleu top"
    * }
    * @example request - update image, address, phone and city
    * {
    *   "image": "http://cityzen.fr/upload/fnikrefvnipndxpmpi",
    *   "address": "rue du Ruby",
    *   "phone": "0657847596",
    *   "city": "Marseille"
    * }
    * @example response - 200 - example success response
    *{
    *  "data": [
    *    {
    *     "id": 38,
    *     "slug": "le%20bleu%20top%20aulnay-sous-bois",
    *     "title": "Le bleu top",
    *     "description": "Une bonne bleu",
    *     "url_image": "http://localhost:3000/uploads/1721215792296_Capture d'Ã©cran 2024-01-26130504.png",
    *     "address": "103 chemin du moulin de la * ville",
    *     "phone": "0624875896",
    *     "avg_rating": null,
    *     "latitude": "48.9519058",
    *     "longitude": "2.500601",
    *     "id_user": 2,
    *     "id_city": 34538,
    *     "created_at": "2024-07-17T11:29:52.840Z",
    *     "updated_at": "2024-07-17T11:50:12.801Z"
    *    }
    *  ]
    *}
    * @example response - 400 - example 400 response
    * {
    *   "error": "Bad request. Invalid value"
    * }
    * @example response - 404 - example 404 response
    * {
    *   "error": "Bad request. Not found"
    * }
   */
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

    /**
    * DELETE profil/activity/{id}
    * @summary Delete one activity by the user
    * @tags Activity
    * @param {number} id.path.required
    * @return {array<GetFavorite>} 200 - Success response - application/json
    * @return {ApiError} 400 - Bad request. Invalid value - application/json
    * @return {ApiError} 404 - Bad request. Not found - application/json
    * @example response - 200 - example success response
    *{
    *  "data": [
    *    {
    *      "id": 30,
    *      "id_user": 1,
    *      "id_activity": 30,
    *      "created_at": "2024-07-16T13:26:41.701Z",
    *      "updated_at": null,
    *      "slug": "sauveur-marseille",
    *      "title": "Sauveur",
    *      "description": "Sauveur",
    *      "url_image": "https://s3-media2.fl.yelpcdn.com/bphoto/h1J_sFKYsxYj0Wix0J1AHQ/o.jpg",
    *      "address": "10 rue d'Aubagne",
    *      "phone": "+33491543396",
    *      "avg_rating": "4.4",
    *      "latitude": "43.295589",
    *      "longitude": "5.379063",
    *      "id_city": 4343
    *   }
    * ]
    *}
    * @example response - 400 - example 400 response
    * {
    * "error": "Bad request. Invalid value"
    * }
    * @example response - 404 - example 404 response
    * {
    * "error": "Bad request. Not found"
    * }
    * @example response - 403 - example 403 response
    * {
    * "error": "Forbidden. You don\'t have access"
    * }
   */
  .delete(
    // doubleCsrfProtection, 
    validationSchema(profilActivityDeleteSchema, 'params', undefined, true),
    catchHandlerController(profilController.activities.destroy)
  );

// To handle rating activities of the user
profilRouter
  .route('/rating')

  /**
    * GET /profil/rating
    * @summary Get all user activities rating
    * @tags Rating
    * @return {array<GetRatingActivity>} 200 - Success response - application/json
    * @example response - 200 - example success response
    *{
    *      "data": [
    *   {
    *   "id": 20,
    *   "id_user": 1,
    *   "id_activity": 20,
    *   "id_rating": 4,
    *   "created_at": "2024-07-16T13:26:28.398Z",
    *   "updated_at": null,
    *   "slug": "la-fontaine-de-mars-paris-2",
    *   "title": "La Fontaine de Mars",
    *   "description": "La Fontaine de Mars",
    *   "url_image": "https://s3-media3.fl.yelpcdn.com/bphoto/uI4ifexZBDt-tW1Im7B_8w/o.jpg",
    *   "address": "129 rue Saint-Dominique",
    *   "phone": "+33147054644",
    *   "avg_rating": "4.4",
    *   "latitude": "48.858394",
    *   "longitude": "2.302568",
    *   "id_city": 29245
    *   } 
    * ],
    *       "avgRating": "4.0000000000000000"
    *}
  */
  .get(catchHandlerController(profilController.ratings.index));

profilRouter
  .route('/rating/:id(\\d+)') // id refers to an activity

    /**
    * GET /profil/rating/{id}
    * @summary Get all user activities rating
    * @tags Rating
    * @param {number} id.path.required
    * @return {array<GetRating>} 200 - Success response - application/json
    * @example response - 200 - example success response
    *{
    *      "data": [
    *   {
    *     "id": 1,
    *     "id_user": 2,
    *     "id_activity": 20,
    *     "id_rating": 4,
    *     "created_at": "2024-07-17T12:37:40.166Z",
    *     "updated_at": null
    *   } 
    * ],
    *}
  */
  .get(catchHandlerController(profilController.ratings.show))

      /**
    * PATCH /profil/rating/{id}
    * @summary Update a rating
    * @tags Rating
    * @param {number} id.path.required - Activity ID to be updated
    * @param {PatchRating} request.body.required - Activity infos
    * @return {array<GetRating>} 200 - Success response - application/json
    * @return {ApiError} 400 - Bad request. Invalid value - application/json
    * @return {ApiError} 404 - Bad request. Not found - application/json
    * @example request - update title
    * {
    *   "rating": 2
    * }
    * @example response - 200 - example success response
    *{
    *  "data": [
    *    {
    *     "id": 1,
    *     "id_user": 2,
    *     "id_activity": 20,
    *     "id_rating": 4,
    *     "created_at": "2024-07-17T12:37:40.166Z",
    *     "updated_at": null
    *    }
    *  ]
    *}
    * @example response - 400 - example 400 response
    * {
    *   "error": "Bad request. Invalid value"
    * }
    * @example response - 404 - example 404 response
    * {
    *   "error": "Bad request. Not found"
    * }
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
