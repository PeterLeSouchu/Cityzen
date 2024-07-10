import dataMapper from '../dataMapper/dataMapper.js';

const activityController = {
  async index(req, res) {
    // Utilisation de req.query pour récupérer les paramètres
    const country = req.params.country;
    const city = req.params.city;
    try {
      const activitiesOfCity = await dataMapper.findAll(country, city);
      res.status(200).json(activitiesOfCity);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        success: false,
      });
    }
  },

  async recent(req, res) {
    try {
      const activityRecents = await dataMapper.findRecent();
      res.status(200).json(activityRecents);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        success: false,
      });
    }
  },

  async showDetails(req, res) {
    try {
      const activityId = Number(req.params.id);
      const activity = await dataMapper.findBypk(activityId);
      res.status(200).json(activity);
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  },

  async store(req, res) {
    try {
      const city = await dataMapper.findBypk(req.body.city);

      if (!city) {
        return res.status(400).send('Invalid City');
      }

      const newActivity = new Activity({
        slug: req.body.alias,
        url: req.body.url,
        title: req.body.name,
        description: req.body.name,
        url_image: req.body.image_url,
        address: req.body.location.address1,
        phone: req.body.phone,
        avg_rating: req.body.rating,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        id_user: req.body.id_user,
        id_city: req.body.id_city,
        cityname: req.body.cityname,
      });

      const activity = await dataMapper.create(newActivity);
      res.status(200).json(activity);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        success: false,
      });
    }
  },

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const activity = await dataMapper.findBypkAndDelete(id);
      res.status(200).json(activity);
    } catch (error) {
      res.status(500).json({
        error: error.message,
        success: false,
      });
    }
  },
};

export default activityController;
