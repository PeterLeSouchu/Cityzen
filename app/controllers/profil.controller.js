// TIERCE MODULES
import 'dotenv/config';

// EXTERNAL MODULES
import ApiError from '../errors/api.error.js';
import activityDatamapper from '../models/activity.datamapper.js';
import cityDatamapper from '../models/city.datamapper.js';
import profilDatamapper from '../models/profil.datamapper.js';
import userActivityRatingDatamapper from '../models/user-activity-rating.datamapper.js';
import getCoordinates from '../utils/get-coordinate.js';
import errors from '../errors/errors.js';
import userDatamapper from '../models/user.datamapper.js';

const {
  internalServerError,
  activityError,
  cityError,
  forbidden,
  userError,
  ratingError,
} = errors;

const profilController = {
  RADIX_NUMBER: 10,

  favorites: {
    async index(req, res, next) {
      try {
        const userId = req.session.userId;
        const activities = await profilDatamapper.favorites.getAll(userId);

        res.status(200).json({ data: activities });
      } catch (error) {
        next(
          new ApiError(
            internalServerError.details,
            internalServerError.message.global,
            null
          )
        );
        return;
      }
    },

    async store(req, res, next) {
      try {
        const userId = req.session.userId;
        const activityId = Number.parseInt(
          req.body.id,
          profilController.RADIX_NUMBER
        );

        // Check if activity to be store in favorites exist
        const existActivity = await activityDatamapper.getOne(activityId);
        if (!existActivity) {
          next(
            new ApiError(
              activityError.details,
              activityError.message.notFound,
              null
            )
          );
          return;
        }

        // Check if activity is already store in user's favorites
        const userHasActivity = await profilDatamapper.favorites.getOne(
          userId,
          activityId
        );
        if (userHasActivity) {
          next(
            new ApiError(
              activityError.details,
              activityError.message.alreadyStored,
              null
            )
          );
          return;
        }

        // Store activity in user's favorites
        await profilDatamapper.favorites.saveFavorite(userId, activityId);

        res.status(201).json({ data: [existActivity] });
      } catch (error) {
        throw new ApiError(
          internalServerError.details,
          internalServerError.message.global,
          error
        );
      }
    },

    async destroy(req, res, next) {
      try {
        const userId = req.session.userId;
        const activityId = Number.parseInt(
          req.params.id,
          profilController.RADIX_NUMBER
        );

        // Check if activity is already exist
        const existActivity = await activityDatamapper.getOne(activityId);
        if (!existActivity) {
          next(
            new ApiError(
              activityError.details,
              activityError.message.notFound,
              null
            )
          );
          return;
        }

        // Check if the activity is stored in the user's favorites
        const userHasActivity = await profilDatamapper.favorites.getOne(
          userId,
          activityId
        );
        if (!userHasActivity) {
          next(
            new ApiError(
              activityError.details,
              activityError.message.notFound,
              null
            )
          );
          return;
        }

        await profilDatamapper.favorites.removedFavorite(userId, activityId);

        res.status(200).json({ data: [existActivity] });
      } catch (error) {
        throw new ApiError(
          internalServerError.details,
          internalServerError.message.global,
          error
        );
      }
    },
  },

  activities: {
    async index(req, res, next) {
      try {
        const userId = req.session.userId;
        const activities = await profilDatamapper.activities.getAll(userId);

        res.status(200).json({ data: activities });
      } catch (error) {
        throw new ApiError(
          internalServerError.details,
          internalServerError.message.global,
          error
        );
      }
    },

    async store(req, res, next) {
      try {
        const userId = req.session.userId;
        const { title, description, address, phone, city } = req.body;
        const imageUrl = req.file
          ? `${process.env.HOST}:${process.env.PORT}/uploads/${req.file.filename}`
          : null;
        // Generate the initial slug
        let slug = encodeURIComponent(title.toLowerCase());

        // Check if an activity with the same slug already exists
        const activitesExistantes = await activityDatamapper.getAllBySlug(slug);
        if (activitesExistantes.length > 0) {
          // Add city to slug if an activity with the same slug exists
          slug += `%20${encodeURIComponent(city.toLowerCase())}`;
        }

        // Check again if an activity with the slug (including city) exists
        const activitesAvecSlugVille = await activityDatamapper.getAllBySlug(
          slug
        );
        if (activitesAvecSlugVille.length > 0) {
          // Add a number to the slug to ensure its uniqueness
          const nombreActivites = activitesAvecSlugVille.length;
          slug += `%20${nombreActivites + 1}`;
        }

        const cityFromDB = await cityDatamapper.getOneByName(city);
        if (!cityFromDB) {
          next(
            new ApiError(cityError.details, cityError.message.notFound, null)
          );
          return;
        }

        // Get latitude and longitude from address user by an external API
        const coordinates = await getCoordinates(address, cityFromDB.name);
        const latitude = coordinates.lat;
        const longitude = coordinates.lon;

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

        const createdActivity = await profilDatamapper.activities.create(
          activityToCreate
        );

        res.status(201).json({ data: [createdActivity] });
      } catch (error) {
        throw new ApiError(
          internalServerError.details,
          internalServerError.message.global,
          error
        );
      }
    },

    async update(req, res, next) {
      try {
        const userId = req.session.userId;
        const activityId = Number.parseInt(
          req.params.id,
          profilController.RADIX_NUMBER
        );

        // Check if activity to be update exist
        const existActivity = await activityDatamapper.getOne(activityId);
        if (!existActivity) {
          next(
            new ApiError(
              activityError.details,
              activityError.message.notFound,
              null
            )
          );
          return;
        }

        // Get city of the activity
        const cityActivity = await cityDatamapper.getOneById(
          existActivity.id_city
        );
        if (!cityActivity) {
          next(
            new ApiError(cityError.details, cityError.message.notFound, null)
          );
          return;
        }

        // Check if activity is created by this user
        const createdActivityByUser = await profilDatamapper.activities.getOne(
          userId,
          activityId
        );
        if (!createdActivityByUser) {
          next(
            new ApiError(
              forbidden.details,
              forbidden.message.permissionDenied,
              null
            )
          );
          return;
        }

        const { title, address, city } = req.body;
        const imageUrl = req.file
          ? `${process.env.HOST}:${process.env.PORT}/uploads/${req.file.filename}`
          : existActivity.url_image;
        let slug = existActivity.slug;
        let titleForSlug = existActivity.title;
        let cityForSlug = cityActivity.name;

        if (title || city) {
          titleForSlug = title ? title : titleForSlug;
          cityForSlug = city ? city : cityForSlug;

          slug = encodeURIComponent(titleForSlug.toLowerCase());
          const sameActivityExist = await activityDatamapper.getAllBySlug(slug);
          if (sameActivityExist) {
            slug += `%20${cityForSlug.toLowerCase()}`;
          }

          const sameActivityExistWithCity =
            await activityDatamapper.getAllBySlug(slug);
          if (sameActivityExistWithCity.length > 0) {
            const numberOfActivities = sameActivityExistWithCity.length;
            slug += `%20${numberOfActivities + 1}`;
          }
        }

        const cityFromDB = city
          ? await cityDatamapper.getOneByName(city)
          : cityActivity;
        let latitude = existActivity.latitude;
        let longitude = existActivity.longitude;
        if (city) {
          const coordinates = await getCoordinates(address, cityFromDB.name);
          latitude = coordinates.lat;
          longitude = coordinates.lon;
        }

        const activityToUpdate = {
          ...req.body,
          slug,
          latitude,
          longitude,
          image: imageUrl,
          title: titleForSlug,
          cityId: cityFromDB.id,
        };
        delete activityToUpdate.city;

        const updatedActivity = await profilDatamapper.activities.update(
          activityToUpdate,
          activityId
        );

        res.status(200).json({ data: [updatedActivity] });
      } catch (error) {
        throw new ApiError(
          internalServerError.details,
          internalServerError.message.global,
          error
        );
      }
    },

    async destroy(req, res, next) {
      try {
        const userId = req.session.userId;
        const activityId = Number.parseInt(
          req.params.id,
          profilController.RADIX_NUMBER
        );

        // Check if activity is already exist
        const existActivity = await activityDatamapper.getOne(activityId);
        if (!existActivity) {
          next(
            new ApiError(
              activityError.details,
              activityError.message.notFound,
              null
            )
          );
          return;
        }

        // Check if the activity to be destroy was created by this user
        const userHasActivity = await profilDatamapper.activities.getOne(
          userId,
          activityId
        );
        if (!userHasActivity) {
          next(
            new ApiError(
              forbidden.details,
              forbidden.message.permissionDenied,
              null
            )
          );
          return;
        }

        const removedActivity =
          await profilDatamapper.activities.removeActivity(userId, activityId);

        res.status(200).json({ data: removedActivity });
      } catch (error) {
        throw new ApiError(
          internalServerError.details,
          internalServerError.message.global,
          error
        );
      }
    },
  },

  ratings: {
    async index(req, res, next) {
      try {
        const userId = req.session.userId;

        const userFounded = await userDatamapper.showById(userId);
        if (!userFounded) {
          next(
            new ApiError(userError.details, userError.message.notFound, null)
          );
          return;
        }

        const userActivitiesRating =
          await profilDatamapper.ratings.getAllActivities(userId);

        const avgRating = await profilDatamapper.ratings.getAvg(userId);

        res.status(200).json({
          data: userActivitiesRating,
          avgRating: avgRating,
        });
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
        const userId = req.session.userId;
        const activityId = Number.parseInt(
          req.params.id,
          profilController.RADIX_NUMBER
        );

        const userFounded = await userDatamapper.showById(userId);
        if (!userFounded) {
          next(
            new ApiError(userError.details, userError.message.notFound, null)
          );
          return;
        }

        const existActivity = await activityDatamapper.getOne(activityId);
        if (!existActivity) {
          next(
            new ApiError(
              activityError.details,
              activityError.message.notFound,
              null
            )
          );
          return;
        }

        const userHasRateActivity = await userActivityRatingDatamapper.getOne(
          userId,
          activityId
        );
        if (!userHasRateActivity) {
          next(
            new ApiError(
              ratingError.details,
              ratingError.message.notFound,
              null
            )
          );
          return;
        }

        res.status(200).json({ data: [userHasRateActivity] });
      } catch (error) {
        throw new ApiError(
          internalServerError.details,
          internalServerError.message.global,
          error
        );
      }
    },

    async store(req, res, next) {
      try {
        const userId = req.session.userId;
        const activityId = Number.parseInt(
          req.params.id,
          profilController.RADIX_NUMBER
        );
        const userRating = Number.parseInt(
          req.body.rating,
          profilController.RADIX_NUMBER
        );

        const userFounded = await userDatamapper.showById(userId);
        if (!userFounded) {
          next(
            new ApiError(userError.details, userError.message.notFound, null)
          );
          return;
        }

        const existActivity = await activityDatamapper.getOne(activityId);
        if (!existActivity) {
          next(
            new ApiError(
              activityError.details,
              activityError.message.notFound,
              null
            )
          );
          return;
        }

        // Check if user has already rate this activity
        const userHasRateActivity = await userActivityRatingDatamapper.getOne(
          userId,
          activityId
        );
        if (userHasRateActivity) {
          next(
            new ApiError(
              ratingError.details,
              ratingError.message.alreadyRated,
              null
            )
          );
          return;
        }

        const userActivityWithRating =
          await profilDatamapper.ratings.saveRating(
            userId,
            activityId,
            userRating
          );

        res.status(201).json({ data: [userActivityWithRating] });
      } catch (error) {
        throw new ApiError(
          internalServerError.details,
          internalServerError.message.global,
          error
        );
      }
    },

    async update(req, res, next) {
      try {
        const userId = req.session.userId;
        const activityId = Number.parseInt(
          req.params.id,
          profilController.RADIX_NUMBER
        );
        const userRating = Number.parseInt(
          req.body.rating,
          profilController.RADIX_NUMBER
        );

        const userFounded = await userDatamapper.showById(userId);
        if (!userFounded) {
          next(
            new ApiError(userError.details, userError.message.notFound, null)
          );
          return;
        }

        const existActivity = await activityDatamapper.getOne(activityId);
        if (!existActivity) {
          next(
            new ApiError(
              activityError.details,
              activityError.message.notFound,
              null
            )
          );
          return;
        }

        // Check if user has already rate this activity
        const userHasRateActivity = await userActivityRatingDatamapper.getOne(
          userId,
          activityId
        );
        if (!userHasRateActivity) {
          next(
            new ApiError(
              ratingError.details,
              ratingError.message.notFound,
              null
            )
          );
          return;
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
      } catch (error) {
        throw new ApiError(
          internalServerError.details,
          internalServerError.message.global,
          error
        );
      }
    },
  },
};

export default profilController;
