import makeSlug from "../utils/make-slug.js";


const profilController = {
  async index(req, res) {

    const user = req.session.userId;

    console.log(user);
  },

   async store(req, res) {

    console.log(req.query);

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