// EXTERNAL MODULES
import ApiError from '../errors/api.error.js';
import activityDatamapper from '../models/activity.datamapper.js';

const activityController = {
  async index(req, res) {
    try {
      const { country, city } = req.params;

      const activitiesOfCity = await activityDatamapper.findActivityOfCity(
        country,
        city
      );

      if (!activitiesOfCity || activitiesOfCity.length === 0) {
        const requestError = new ApiError("This activity don't exist", {
          status: 400,
        });
        requestError.name = 'BadRequest';

        throw requestError;
      }

      res.status(200).json({ data: activitiesOfCity });
    } catch (error) {
      const requestError = new ApiError(
        'Internal Server Error, please contact your administrator',
        {
          status: 500,
        }
      );
      requestError.name = 'InternalServerError';
      throw requestError;
    }
  },

  async show(req, res) {
    try {
      const slug = req.params.slug;
      const activity = await activityDatamapper.getOneBySlug(slug);

      if (!activity) {
        const requestError = new ApiError("This activity don't exist", {
          status: 400,
        });
        requestError.name = 'BadRequest';
        throw requestError;
      }

      res.status(200).json({ data: [activity] });
    } catch (error) {
      const requestError = new ApiError(
        'Internal Server Error, please contact your administrator',
        {
          status: 500,
        }
      );
      requestError.name = 'InternalServerError';
      throw requestError;
    }
  },

  async showRecent(req, res) {
    try {
      const recentActivities = await activityDatamapper.getRecents();

      if (!recentActivities || recentActivities.length === 0) {
        const requestError = new ApiError('Recent activities not founds', {
          status: 400,
        });
        requestError.name = 'BadRequest';
        throw requestError;
      }

      res.status(200).json({ data: recentActivities });
    } catch (error) {
      const requestError = new ApiError(
        'Internal Server Error, please contact your administrator',
        {
          status: 500,
        }
      );
      requestError.name = 'InternalServerError';
      throw requestError;
    }
  },

  async showRating(req, res) {
    try {
      const ratingActivities = await activityDatamapper.findActivitiesRating();

      if (!ratingActivities || ratingActivities.length === 0) {
        const requestError = new ApiError('Rating activities not founds', {
          status: 400,
        });
        requestError.name = 'BadRequest';
        throw requestError;
      }

      res.status(200).json({ data: ratingActivities });
    } catch (error) {
      const requestError = new ApiError(
        'Internal Server Error, please contact your administrator',
        {
          status: 500,
        }
      );
      requestError.name = 'InternalServerError';
      throw requestError;
    }
  },
};

export default activityController;
