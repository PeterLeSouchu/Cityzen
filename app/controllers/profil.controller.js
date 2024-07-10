import ApiError from "../errors/api.error.js";
import activityDatamapper from "../models/activity.datamapper.js";
import profilDatamapper from "../models/profil.datamapper.js";
import makeSlug from "../utils/make-slug.js";


const profilController = {
  RADIX_NUMBER: 10,

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
      const existActivity = await activityDatamapper.getOne(activityId);
      if(!existActivity) {
        const requestError = new ApiError('This activity already exist', {status: 400});
        requestError.name = "BadRequest";
        throw requestError;
      }

      // Check if activity is already saved ti the user's favorites
      console.log(userId, activityId);
      const userHasActivity = await profilDatamapper.favorites.getOne(userId, activityId);
      if(userHasActivity) {
        const requestError = new ApiError('This activity already saved', {status: 400});
        requestError.name = "BadRequest";
        throw requestError;
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
      const existActivity = await activityDatamapper.getOne(activityId);
      if(!existActivity) {
        const requestError = new ApiError('This activity already exist', {status: 400});
        requestError.name = "BadRequest";
        throw requestError;
      }

      // Check if activity is already saved ti the user's favorites
      const userHasActivity = await profilDatamapper.favorites.getOne(userId, activityId);
      if(!userHasActivity) {
        const requestError = new ApiError('This activity not saved by the user', {status: 400});
        requestError.name = "BadRequest";
        throw requestError;
      }


      console.log(userId, activityId);
      const removedFavorite = await profilDatamapper.favorites.removedFavorite(userId, activityId);

      res.status(200).json({data: removedFavorite});
    }
  }



};

export default profilController;