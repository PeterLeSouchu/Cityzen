import activityDatamapper from "../models/activity.datamapper.js";

const activityController = {
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

 

};

export default activityController;
