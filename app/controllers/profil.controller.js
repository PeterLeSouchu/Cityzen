// TIERCE MODULES
import 'dotenv/config';

// EXTERNAL MODULES
import ApiError from '../errors/api.error.js';
import activityDatamapper from '../models/activity.datamapper.js';
import cityDatamapper from '../models/city.datamapper.js';
import profilDatamapper from '../models/profil.datamapper.js';
import userActivityRatingDatamapper from '../models/user-activity-rating.datamapper.js';
import getCoordinates from '../utils/get-coordinate.js';


const profilController = {
  RADIX_NUMBER: 10,

  favorites: {
    async index(req, res) {
      // const userId = req.cookies.userId;
      const userId = req.session.userId;

      const activities = await profilDatamapper.favorites.getAll(userId);
      res.status(200).json({ data: activities });
    },

    async store(req, res) {
      // const userId = req.cookies.userId;
      const userId = req.session.userId;
      const activityId = Number.parseInt(
        req.body.id,
        profilController.RADIX_NUMBER
      );

      // Check if activity is already exist
      const existActivity = await activityDatamapper.getOne(activityId);
      if (!existActivity) {
        const requestError = new ApiError("This activity don't exist", {
          status: 400,
        });
        requestError.name = 'BadRequest';

        throw requestError;
      }

      // Check if activity is already saved ti the user's favorites
      console.log(userId, activityId);
      const userHasActivity = await profilDatamapper.favorites.getOne(
        userId,
        activityId
      );
      if (userHasActivity) {
        const requestError = new ApiError('This activity already saved', {
          status: 400,
        });
        requestError.name = 'BadRequest';
        throw requestError;
      }

      // Save favorite in DB for this user
      const activityForUser = await profilDatamapper.favorites.saveFavorite(
        userId,
        activityId
      );

      console.log(existActivity);

      res.status(201).json({ data: existActivity });
    },

    async destroy(req, res) {
      // const userId = req.cookies.userId;
      const userId = req.session.userId;
      const activityId = Number.parseInt(
        req.params.id,
        profilController.RADIX_NUMBER
      );

      // Check if activity is already exist
      const existActivity = await activityDatamapper.getOne(activityId);
      if (!existActivity) {
        const requestError = new ApiError("This activity don't exist", {
          status: 400,
        });
        requestError.name = 'BadRequest';
        throw requestError;
      }

      // Check if activity is already saved in the user's favorites
      const userHasActivity = await profilDatamapper.favorites.getOne(
        userId,
        activityId
      );
      if (!userHasActivity) {
        const requestError = new ApiError(
          'This activity not saved by the user',
          { status: 400 }
        );
        requestError.name = 'BadRequest';
        throw requestError;
      }

      console.log(userId, activityId);

      const removedFavorite = await profilDatamapper.favorites.removedFavorite(
        userId,
        activityId
      );

      res.status(200).json({ data: existActivity });
    },
  },

  activities: {
    async index(req, res) {
      console.log(req.body);
      const userId = req.session.userId;
      const activities = await profilDatamapper.activities.getAll(userId);

      res.status(200).json({ data: activities });
    },

    async store(req, res) {
      const userId = req.session.userId
      const { title, description, address, phone, city } = req.body;
      const imageUrl = req.file
        ? `${process.env.HOST}:${process.env.PORT}/uploads/${req.file.filename}`
        : null
      ;

      // Generate the initial slug
      let slug = encodeURIComponent(title.toLowerCase());

      // Check if an activity with the same slug already exists
      const activitesExistantes = await activityDatamapper.getAllBySlug(slug);
      if (activitesExistantes.length > 0) {
        // Add city to slug if an activity with the same slug exists
        slug += `%20${encodeURIComponent(city.toLowerCase())}`;
      }

      // Check again if an activity with the slug (including city) exists
      const activitesAvecSlugVille = await activityDatamapper.getAllBySlug(slug);
      //console.log(activitesAvecSlugVille);
      if (activitesAvecSlugVille.length > 0) {
        // Add a number to the slug to ensure its uniqueness
        const nombreActivites = activitesAvecSlugVille.length;
        slug += `%20${nombreActivites + 1}`;
      }

      // Found the city by name
      const cityFromDB = await cityDatamapper.getOneByName(city);

      // Get latitude and longitude from address user by an external API
      const coordinates = await getCoordinates(address);
      const latitude = coordinates.lat;
      const longitude = coordinates.lon;

      // new activity object
      const activityToCreate = {
        slug,
        title,
        description,
        image: imageUrl,
        address,
        phone,
        latitude,
        longitude,
        userId,
        cityId: cityFromDB.id,
      };

      console.log(activityToCreate);

      // const createdActivity = await profilDatamapper.activities.create(
      //   activityToCreate
      // );

      res.status(201).json({ data: [createdActivity] });
    },

    async update(req, res) {
      const userId = req.session.userId;
      const activityId = Number.parseInt(
        req.params.id,
        profilController.RADIX_NUMBER
      );

      // Check if activity is already exist
      const existActivity = await activityDatamapper.getOne(activityId);
      if (!existActivity) {
        const requestError = new ApiError("This activity don't exist", {
          status: 400,
        });
        requestError.name = 'BadRequest';
        throw requestError;
      }

      const cityActivity = await cityDatamapper.getOneById(
        existActivity.id_city
      );

      // Check if activity is created by this user
      const createdActivityByUser = await profilDatamapper.activities.getOne(
        userId,
        activityId
      );
      if (!createdActivityByUser) {
        const requestError = new ApiError(
          'This activity not created by this user',
          { status: 403 }
        );
        requestError.name = 'Forbidden';
        throw requestError;
      }

      const { title, city } = req.body;

      let slug = '';

      if (title || city) {
        let titleForSlug = title ? title : existActivity.title;
        let cityForSlug = city ? city : cityActivity.name;

        slug = encodeURIComponent(titleForSlug.toLowerCase());
        const sameActivityExist = await activityDatamapper.getAllBySlug(slug);
        if (sameActivityExist) {
          slug += `%20${cityForSlug.toLowerCase()}`;
        }

        const sameActivityExistWithCity = await activityDatamapper.getAllBySlug(
          slug
        );
        console.log(sameActivityExistWithCity);
        if (sameActivityExistWithCity.length > 0) {
          const numberOfActivities = sameActivityExistWithCity.length;
          slug += `%20${numberOfActivities + 1}`;
        }
      }

      const cityFromDB = city
        ? await cityDatamapper.getOneByName(city)
        : cityActivity;

      const activityToUpdate = {
        ...req.body,
        slug,
        title: existActivity.title,
        cityId: cityFromDB.id,
      };
      delete activityToUpdate.city;

      const updatedActivity = await profilDatamapper.activities.update(
        activityToUpdate,
        activityId
      );

      res.status(200).json({ data: [updatedActivity] });
    },

    async destroy(req, res) {
      const userId = req.session.userId;
      const activityId = Number.parseInt(
        req.params.id,
        profilController.RADIX_NUMBER
      );

      // Check if activity is already exist
      const existActivity = await activityDatamapper.getOne(activityId);

      if (!existActivity) {
        const requestError = new ApiError(
          'The activity is not in the registered activities',
          { status: 400 }
        );
        requestError.name = 'BadRequest';
        throw requestError;
      }

      // Check if activity is already saved ti the user's favorites
      const userHasActivity = await profilDatamapper.activities.getOne(
        userId,
        activityId
      );
      if (!userHasActivity) {
        const requestError = new ApiError(
          'This activity not saved by the user',
          { status: 400 }
        );
        requestError.name = 'BadRequest';
        throw requestError;
      }

      const removedActivity = await profilDatamapper.activities.removeActivity(
        userId,
        activityId
      );

      res.status(200).json({ data: removedActivity });
    },
  },

  ratings: {
    async index(req, res) {
      const userId = req.session.userId;

      const userActivitiesRating =
        await profilDatamapper.ratings.getAllActivities(userId);

      const avgRating = await profilDatamapper.ratings.getAvg(userId);

      res.status(200).json({
        data: userActivitiesRating,
        avgRating: avgRating.avg,
      });
    },

    async show(req, res) {
      const userId = req.session.userId;
      const activityId = Number.parseInt(
        req.params.id,
        profilController.RADIX_NUMBER
      );

      const existActivity = await activityDatamapper.getOne(activityId);
      if (!existActivity) {
        const requestError = new ApiError("This activity don't exist", {
          status: 400,
        });
        requestError.name = 'BadRequest';
        throw requestError;
      }

      const userHasRateActivity = await userActivityRatingDatamapper.getOne(
        userId,
        activityId
      );
      if (!userHasRateActivity) {
        const requestError = new ApiError("The user don't rate this activity", {
          status: 400,
        });
        requestError.name = 'BadRequest';
        throw requestError;
      }

      res.status(200).json({ data: [userHasRateActivity] });
    },

    async store(req, res) {
      const userId = req.session.userId;
      const activityId = Number.parseInt(
        req.params.id,
        profilController.RADIX_NUMBER
      );
      const userRating = Number.parseInt(
        req.body.rating,
        profilController.RADIX_NUMBER
      );

      const existActivity = await activityDatamapper.getOne(activityId);
      if (!existActivity) {
        const requestError = new ApiError("This activity don't exist", {
          status: 400,
        });
        requestError.name = 'BadRequest';
        throw requestError;
      }

      // Check if user has already rate this activity
      const userHasRateActivity = await userActivityRatingDatamapper.getOne(
        userId,
        activityId
      );
      if (userHasRateActivity) {
        const requestError = new ApiError(
          'The user has already rate this activity',
          { status: 400 }
        );
        requestError.name = 'BadRequest';
        throw requestError;
      }

      const userActivityWithRating = await profilDatamapper.ratings.saveRating(
        userId,
        activityId,
        userRating
      );

      res.status(201).json({ data: [userActivityWithRating] });
    },

    async update(req, res) {
      const userId = req.session.userId;
      const activityId = Number.parseInt(
        req.params.id,
        profilController.RADIX_NUMBER
      );
      const userRating = Number.parseInt(
        req.body.rating,
        profilController.RADIX_NUMBER
      );

      const existActivity = await activityDatamapper.getOne(activityId);
      if (!existActivity) {
        const requestError = new ApiError("This activity don't exist", {
          status: 400,
        });
        requestError.name = 'BadRequest';
        throw requestError;
      }

      // Check if user has already rate this activity
      const userHasRateActivity = await userActivityRatingDatamapper.getOne(
        userId,
        activityId
      );
      if (!userHasRateActivity) {
        const requestError = new ApiError("The user don't rate this activity", {
          status: 400,
        });
        requestError.name = 'BadRequest';
        throw requestError;
      }

      const oldUserRating = userHasRateActivity.id_rating;

      const userActivityWithRating =
        await profilDatamapper.ratings.updateRating(
          userId,
          activityId,
          userRating,
          oldUserRating
        );

      res.status(200).json({ data: userActivityWithRating });
    },
  },
};

export default profilController;
