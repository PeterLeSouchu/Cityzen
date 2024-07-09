import activityDatamapper from "../models/activity.datamapper.js";
import profilDatamapper from "../models/profil.datamapper.js";
import makeSlug from "../utils/make-slug.js";


const profilController = {

  favorites: {
    async index(req, res) {
  
      const userId = req.session.userId;

      const activities = await profilDatamapper.favorites.getAll(userId);
  
      res.status(200).json({data: activities});
    },
  
    async store(req, res) {
  
      const userId = req.session.userId;
      const activityId = Number.parseInt(req.body.id, 10);

      // Check if activity exist
      const existActivity = await activityDatamapper.getOne(activityId);
      if(!existActivity[0]) {
        return res.status(400).json({error: 'The activity don\'t exist'});
      }

      // Check if activity is already saved ti the user's favorites
      const userHasActivity = await profilDatamapper.favorites.getOne(userId, activityId)
      if(userHasActivity) {
        return res.status(400).json({error: 'The activity already exist'});
      }

      // Save favorite in DB for this user
      const activityForUser = await profilDatamapper.favorites.saveFavorite( userId, activityId);

      res.status(201).json({data: existActivity});
  


      // const { title, description, image, address, phone, longitude, latitude, city } = req.body;
  
  
      // // This real slug but now we use the id at the place of the title
      // const slug = makeSlug(title);
      // // const slug = 
      // const userId = req.session.userId;
  
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
  }



};

export default profilController;