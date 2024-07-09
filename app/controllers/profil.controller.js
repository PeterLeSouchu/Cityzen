import activityDatamapper from "../models/activity.datamapper.js";
import profilDatamapper from "../models/profil.datamapper.js";
import makeSlug from "../utils/make-slug.js";


const profilController = {
  RADIX_NUMBER: 10,

  async checkExistingActivity(activityId) {
    const existActivity = await activityDatamapper.getOne(activityId);
    if(existActivity[0]) {
      return true;
    }
    return false;
  },

  async checkUserHasActivity(userId, activityId) {
    const userHasActivity = await profilDatamapper.favorites.getOne(userId, activityId);
    if(userHasActivity) {
      return true;
    }
    return false;
  },

  throwBadRequestError(message) {
    const requestError = new Error(message);
    requestError.name = "BadRequest";
    throw requestError;
  },

  favorites: {
    async index(req, res) {
  
      // const userId = req.cookies.userId;
      const userId = req.session.userId;

      const activities = await profilDatamapper.favorites.getAll(userId);
  
      res.status(200).json({data: activities});
    },
  
    async store(req, res) {
  
      // const userId = req.cookies.userId;
      const userId = req.session.userId;
      const activityId = Number.parseInt(req.body.id, profilController.RADIX_NUMBER);

      // Check if activity is already exist
      const activityExist = await profilController.checkExistingActivity(activityId);

      if(!activityExist) {
        profilController.throwBadRequestError('The activity don\'t exist');
      }

      // Check if activity is already saved ti the user's favorites
      const userHasActivity = await profilController.checkUserHasActivity(userId, activityId);
      if(userHasActivity) {
        profilController.throwBadRequestError('This activity already saved');
      }

      // Save favorite in DB for this user
      const activityForUser = await profilDatamapper.favorites.saveFavorite( userId, activityId);

      res.status(201).json({data: existActivity});
  


      // const { title, description, image, address, phone, longitude, latitude, city } = req.body;
  
  
      // // This real slug but now we use the id at the place of the title
      // const slug = makeSlug(title);
      // // const slug = 
      // const userId = req.cookies.userId;
  
      // const createdActivity = await profilDatamapper.create({
      //   title,
      //   description,
      //   image,
      //   address,
      //   phone,
      //   longitude,
      //   latitude,
      //   city,
      //   slug,
      //   userId
      // })
  
      // res.status(201).json({})
  
    },

    async destroy(req, res) {
      // const userId = req.cookies.userId;
      const userId = req.session.userId;
      const activityId = Number.parseInt(req.params.id, profilController.RADIX_NUMBER);
      
      // Check if activity is already exist
      const activityExist = await profilController.checkExistingActivity(activityId);
      if(!activityExist) {
        profilController.throwBadRequestError('The activity don\'t exist');
      }

      // Check if activity is already saved ti the user's favorites
      const userHasActivity = await profilController.checkUserHasActivity(userId, activityId);
      if(!userHasActivity) {
        profilController.throwBadRequestError('This activity dont exist for this user');
      }

      console.log(userId, activityId);
      const removedFavorite = await profilDatamapper.favorites.removedFavorite(userId, activityId);

      res.status(200).json({data: removedFavorite});
    }
  }



};

export default profilController;