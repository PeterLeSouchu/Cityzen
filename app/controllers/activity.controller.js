// EXTERNAL MODULES
import ApiError from '../errors/api.error.js';
import errors from '../errors/errors.js';
import activityDatamapper from '../models/activity.datamapper.js';

const { activityError, internalServerError } = errors;

const activityController = {
  async index(req, res, next) {
    try {
      const { city } = req.params;

      // ? Ajouter le check si le pays existe ainsi que la ville ?

      const activitiesOfCity = await activityDatamapper.findActivityOfCity(
        city
      );

      if (!activitiesOfCity || activitiesOfCity.length === 0) {
        next(
          new ApiError(
            activityError.details,
            activityError.message.notFound,
            null
          )
        );
        return;
      }

      res.status(200).json({ data: activitiesOfCity });
    } catch (error) {
      throw new ApiError(
        internalServerError.details,
        internalServerError.message.global,
        error
      );
    }
  },

  async show(req, res, next) {
    try {
      const slug = req.params.slug;
      const activity = await activityDatamapper.getOneBySlug(slug);

      if (!activity) {
        next(
          new ApiError(
            activityError.details,
            activityError.message.notFound,
            null
          )
        );
        return;
      }

      res.status(200).json({ data: [activity] });
    } catch (error) {
      throw new ApiError(
        internalServerError.details,
        internalServerError.message.global,
        error
      );
    }
  },

  async showRecent(req, res, next) {
    try {
      const recentActivities = await activityDatamapper.getRecents();

      if (!recentActivities || recentActivities.length === 0) {
        next(
          new ApiError(
            activityError.details,
            activityError.message.notFound,
            null
          )
        );
        return;
      }

      res.status(200).json({ data: recentActivities });
    } catch (error) {
      throw new ApiError(
        internalServerError.details,
        internalServerError.message.global,
        error
      );
    }
  },

  async showRating(req, res, next) {
    try {
      const ratingActivities = await activityDatamapper.findActivitiesRating();

      if (!ratingActivities || ratingActivities.length === 0) {
        next(
          new ApiError(
            activityError.details,
            activityError.message.notFound,
            null
          )
        );
        return;
      }

      res.status(200).json({ data: ratingActivities });
    } catch (error) {
      throw new ApiError(
        internalServerError.details,
        internalServerError.message.global,
        error
      );
    }
  },
};

export default activityController;
