import activityDatamapper from "../models/activity.datamapper.js";
import profilDatamapper from "../models/profil.datamapper.js";
import makeSlug from "../utils/make-slug.js";


const profilController = {
  async index(req, res) {

    const user = req.session.userId;

    console.log(user);
  },

   async store(req, res) {
     
     if(req.url === '/favorite') {

      const userId = req.session.userId;
      const activityId = Number.parseInt(req.body.id, 10);

      //Check if activity exist
      const existActivity = await activityDatamapper.getOne(activityId);
      if(!existActivity) {
        return res.status(400).json({error: 'The activity don\'t exist'});
      }

      const activityForUser = await profilDatamapper.saveFavorite(activityId, userId);

      res.status(201).json({data: existActivity});
    }

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



};

export default profilController;