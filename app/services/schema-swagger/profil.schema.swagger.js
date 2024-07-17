/**
 * A returned favorite
 * @typedef {object} GetFavorite
 * @property {number} id - favorite ID
 * @property {number} id_user - user ID who created the activity 
 * @property {number} id_activity - activity ID that was saved
 * @property {string} created_at - activity date created in DB (can be change on DB migration)
 * @property  {string} updated_at - activity update date 
 * @property {string} slug - text to display in the url
 * @property {string} title - activity title
 * @property {string} description - activity description
 * @property {string} url_image - activity url image
 * @property {string} address - activity address
 * @property {string} phone - telephone number to contact the person who created the activity or to contact the managers of the activity
 * @property {string} avg_rating - activity average rating
 * @property {string} latitude - activity latitude location
 * @property {string} longitude - activity longitude location
 * @property {number} id_city - city where is the activity
 * 
*/
/* A returned Favorite
{
    "id": 28,
    "id_user": 1,
    "id_activity": 28,
    "created_at": "2024-07-16T13:26:41.697Z",
    "updated_at": null,
    "slug": "le-café-de-la-banque-marseille-2",
    "title": "Le Café de la Banque",
    "description": "Le Café de la Banque",
    "url_image": "https://s3-media1.fl.yelpcdn.com/bphoto/E3NFZzFwHULvA1wsNo9m9w/o.jpg",
    "address": "24 bd Paul Peytral",
    "phone": "+33491333507",
    "avg_rating": "4.4",
    "latitude": "43.29022",
    "longitude": "5.37866",
    "id_city": 4343
}
*/


/**
 * A requested favorite
 * @typedef  {object} PostFavorite
 * @property {string} id.query.required - activity id to be save in user favorites
 */
/* A post Order
    "id": 48,
*/


/**
 * A returned activity
 * @typedef {object} GetActivity
 * @property {number} id - activity ID
 * @property {string} slug - text to display in the url
 * @property {string} title - activity title
 * @property {string} description - activity description
 * @property {string} url_image - activity url image
 * @property {string} address - activity address
 * @property {string} phone - telephone number to contact the person who created the activity or to contact the managers of the activity
 * @property {string} avg_rating - activity average rating
 * @property {string} latitude - activity latitude location
 * @property {string} longitude - activity longitude location
 * @property {number} id_user - user ID who created the activity 
 * @property {number} id_city - city where is the activity
 * @property {string} created_at - activity date created in DB (can be change on DB migration)
 * @property  {string} updated_at - activity update date 
 * 
*/
/* A returned Activity
    {
      "id": 37,
      "slug": "blabla%20aulnay-sous-bois",
      "title": "blabla",
      "description": "blabla",
      "url_image": "http://localhost:3000/uploads/1721206609547_Capture d'Ã©cran 2024-01-26 130504.png",
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
*/


/**
 * A requested activity
 * @typedef  {object} PostActivity
 * @property  {string} title.query.required - activity title 
 * @property  {string} description.query.required - activity description 
 * @property  {object} image.query.required - activity image. File object 
 * @property  {string} address.query.required - activity address 
 * @property  {string} phone.query.required - activity phone 
 * @property  {string} city.query.required - activity city 
 */
/* A post Order
  "title": "La pizza du coin",
  "description": "Une bonne pizza au fromage",
  "image": "http://cityzen.fr/upload/fnikrefvnipndxpmpi", 
  "address": "5 place paul demange ",
  "phone": "0654748965",
  "city": "Montesson"
*/


/**
 * The activity to be patched
 * @typedef {object} PatchActivity 
 * @property  {string} title.query - activity title to update 
 * @property  {string} description.query - activity description to update 
 * @property  {object} image.query - activity image to update. File object 
 * @property  {string} address.query - activity address to update 
 * @property  {string} phone.query - activity phone to update 
 * @property  {string} city.query - activity city to update 
 */
/* A patch Activity
    "title": "le resto du coin"
*/

/**
 * A returned activity with rating user
 * @typedef {object} GetRatingActivity
 * @property {number} id - rating ID
 * @property {number} id_user - user ID who created the activity 
 * @property {number} id_activity - activity ID
 * @property {number} id_rating - user rating ID 
 * @property {string} created_at - activity date created in DB (can be change on DB migration)
 * @property  {string} updated_at - activity update date 
 * @property {string} slug - text to display in the url
 * @property {string} title - activity title
 * @property {string} description - activity description
 * @property {string} url_image - activity url image
 * @property {string} address - activity address
 * @property {string} phone - telephone number to contact the person who created the activity or to contact the managers of the activity
 * @property {string} avg_rating - activity average rating
 * @property {string} latitude - activity latitude location
 * @property {string} longitude - activity longitude location
 * @property {number} id_city - city where is the activity
 * 
*/
/* A returned Article
{
    "id": 28,
    "id_user": 1,
    "id_activity": 28,
    "id_rating": 4,
    "created_at": "2024-07-16T13:26:41.697Z",
    "updated_at": null,
    "slug": "le-café-de-la-banque-marseille-2",
    "title": "Le Café de la Banque",
    "description": "Le Café de la Banque",
    "url_image": "https://s3-media1.fl.yelpcdn.com/bphoto/E3NFZzFwHULvA1wsNo9m9w/o.jpg",
    "address": "24 bd Paul Peytral",
    "phone": "+33491333507",
    "avg_rating": "4.4",
    "latitude": "43.29022",
    "longitude": "5.37866",
    "id_city": 4343
}
*/



/**
 * A returned user rating infos
 * @typedef {object} GetRating
 * @property {number} id - rating ID
 * @property {number} id_user - user ID who rated the activity 
 * @property {number} id_activity - rated activity ID
 * @property {number} id_rating - user rating ID 
 * @property {string} created_at - activity date created in DB (can be change on DB migration)
 * @property  {string} updated_at - activity update date 
 * 
*/
/* A returned Article
{
    "id": 1,
    "id_user": 2,
    "id_activity": 20,
    "id_rating": 2,
    "created_at": "2024-07-17T12:37:40.166Z",
    "updated_at": null
}
*/

