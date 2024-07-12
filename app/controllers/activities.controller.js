
const activitiesController = {
  async index(req, res) {
    try {
      const { country, city } = req.params;

      const activitiesOfCity = await activityDatamapper.findActivityOfCity(
        country,
        city
      );

      if (!activitiesOfCity || activitiesOfCity.length === 0) {
        return res
          .status(404)
          .json({ message: `No activities found for ${city} and ${country}` });
      }

      res.status(200).json(activitiesOfCity);
    } catch (error) {
      console.error('Error in activityController: index method', error.message);
      res.status(500).json({ error: 'An error occurred' });
    }
  },

  async show(req, res) {
    const id = parseInt(req.params.id);
    console.log(id);
    const activity = await activityDatamapper.getOne(id);

    if (!activity) {
      return res
        .status(404)
        .json({ message: `No activity found for id ${id}` });
    }

    res.status(200).json(activity);
  },

  async showRecent(req, res) {
    try {
      const recentActivities = await activityDatamapper.findRecent();

      if (!recentActivities || recentActivities.length === 0) {
        return res.status(404).json({ message: `No recent activities found` });
      }

      res.status(200).json(recentActivities);
    } catch (error) {
      console.error(
        'Error in activityController: showRecent method',
        error.message
      );
      res.status(500).json({ error: 'An error occurred' });
    }
  },

  async showRating(req, res) {
    try {
      const recentActivities = await activityDatamapper.findActivitiesRating();

      if (!recentActivities || recentActivities.length === 0) {
        return res.status(404).json({ message: `No recent activities found` });
      }

      res.status(200).json(recentActivities);
    } catch (error) {
      console.error(
        'Error in activityController: showRecent method',
        error.message
      );
      res.status(500).json({ error: 'An error occurred' });
    }
  },

  async store(req, res) {
    // Destructuration des données de req.body
    const {
      slug,
      url,
      title,
      description,
      url_image,
      address,
      phone,
      avg_rating,
      latitude,
      longitude,
      id_user,
      id_city,
      cityname,
    } = req.body;

    // Vérifier si la ville existe en utilisant le dataMapper
    const city = await activityDatamapper.findCity(id_city); // Utilisation de l'id de la ville pour la recherche

    if (!city) {
      // Si la ville n'existe pas, retourner une erreur 400
      return res.status(400).json({ error: 'Invalid City' });
    }

    const geoCode = await geocoder.geocode(address);
    if (geoCode.length === 0) {
      return res.status(400).json({ error: 'Invalid Address' });
    }

    // Créer une nouvelle activité en utilisant les données de req.body
    const newActivity = {
      slug: slug, // Utilisation de la variable destructurée
      url: url,
      title: title,
      description: description,
      url_image: url_image,
      address: address,
      phone: phone,
      avg_rating: avg_rating,
      latitude: latitude,
      longitude: longitude,
      id_user: id_user,
      id_city: id_city,
      cityname: cityname,
    };

    // Appeler la méthode de création dans dataMapper pour créer l'activité
    const createdActivity = await dataMapper.create(newActivity);

    // Répondre avec l'activité créée en JSON
    res.status(200).json(createdActivity);
  },

};

export default activitiesController;
