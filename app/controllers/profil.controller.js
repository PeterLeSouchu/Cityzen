// TIERCE MODULES
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { hashPassword } from '../utils/bcrypt.js';

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
      const userId = req.session.userId;
      const { title, description, address, phone, city } = req.body;
      const imageUrl = req.file
        ? `${process.env.HOST}/uploads/${req.file.filename}`
        : null;

      // Generate the initial slug
      let slug = encodeURIComponent(
        `${title}-${city}`.toLowerCase().replace(/\s+/g, '-')
      );

      // Check if an activity with the same slug already exists
      const existingActivities = await activityDatamapper.getAllBySlug(slug);
      if (existingActivities.length > 0) {
        // Add a unique suffix to the slug to ensure its uniqueness
        slug += `-${existingActivities.length + 1}`;
      }

      // Find the city by name
      const cityFromDB = await cityDatamapper.getOneByName(city);

      if (!cityFromDB) {
        next(
          new ApiError(
            activityError.details,
            activityError.message.addressFalse,
            null
          )
        );
        return;
      }

      // Get latitude and longitude from address using an external API
      const coordinates = await getCoordinates(address, cityFromDB.name);

      if (!coordinates) {
        next(
          new ApiError(
            activityError.details,
            activityError.message.addressFalse,
            null
          )
        );
        return;
      }
      const { lat: latitude, lon: longitude } = coordinates;

      // Create a new activity object
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

      req.session.imageName = null;
      res.status(201).json({ data: [createdActivity] });
    },

    async update(req, res, next) {
      const userId = req.session.userId;
      const activityId = Number.parseInt(req.params.id, 10);

      // Check if the activity exists
      const existingActivity = await activityDatamapper.getOne(activityId);
      if (!existingActivity) {
        throw new ApiError("This activity doesn't exist", { status: 404 });
      }

      // Check if the activity was created by this user
      const userActivity = await profilDatamapper.activities.getOne(
        userId,
        activityId
      );
      if (!userActivity) {
        throw new ApiError('This activity was not created by this user', {
          status: 403,
        });
      }

      const { title, address, city } = req.body;
      const imageUrl = req.file
        ? `${process.env.HOST}/uploads/${req.file.filename}`
        : existingActivity.url_image;

      // Start with the existing slug, title, and city
      let slug = existingActivity.slug;
      let titleForSlug = existingActivity.title;
      let cityForSlug = (
        await cityDatamapper.getOneById(existingActivity.id_city)
      ).name;

      // If title or city is updated, generate a new slug
      if (title || city) {
        titleForSlug = title || titleForSlug;
        cityForSlug = city || cityForSlug;

        slug = encodeURIComponent(
          `${titleForSlug}-${cityForSlug}`.toLowerCase().replace(/\s+/g, '-')
        );

        const existingActivitiesWithNewSlug =
          await activityDatamapper.getAllBySlug(slug);
        if (existingActivitiesWithNewSlug.length > 0) {
          slug += `-${existingActivitiesWithNewSlug.length + 1}`;
        }
      }

      const cityFromDB = city
        ? await cityDatamapper.getOneByName(city)
        : await cityDatamapper.getOneById(existingActivity.id_city);

      if (!cityFromDB) {
        next(
          new ApiError(
            activityError.details,
            activityError.message.addressFalse,
            null
          )
        );
        return;
      }

      // Update latitude and longitude if city or address changes
      let { latitude, longitude } = existingActivity;
      if (city || address) {
        const coordinates = await getCoordinates(address, cityFromDB.name);
        if (!coordinates) {
          next(
            new ApiError(
              activityError.details,
              activityError.message.addressFalse,
              null
            )
          );
          return;
        }
        latitude = coordinates.lat;
        longitude = coordinates.lon;
      }

      // Update the activity object
      const activityToUpdate = {
        ...req.body,
        slug,
        latitude,
        longitude,
        image: imageUrl,
        title: titleForSlug,
        cityId: cityFromDB.id,
      };
      delete activityToUpdate.city; // remove city from the request body as it has been handled separately

      const updatedActivity = await profilDatamapper.activities.update(
        activityToUpdate,
        activityId
      );

      res.status(200).json({ data: [updatedActivity] });
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
  account: {
    async updatePseudo(req, res, next) {
      const { newPseudo } = req.body;
      const id = req.session.userId;

      try {
        // Verification if user exist
        const user = await profilDatamapper.account.getOneUser(id);

        if (!user) {
          next(
            new ApiError(userError.details, userError.message.notFound, null)
          );
          return;
        }

        // // Verification if pseudo is used
        // const pseudoExist = await profilDatamapper.account.checkPseudo(
        //   newPseudo
        // );

        // if (pseudoExist) {
        //   console.log('pseudo exist');
        //   next(
        //     new ApiError(userError.details, userError.message.pseudoExist, null)
        //   );
        //   return;
        // }

        // Update pseudo
        await profilDatamapper.account.updatePseudo(newPseudo, id);

        res.status(200).json({ data: [newPseudo] });
      } catch (error) {
        throw new ApiError(
          internalServerError.details,
          internalServerError.message.global,
          error
        );
      }
    },
    async updatePassword(req, res, next) {
      try {
        const id = req.session.userId;
        const { oldPassword, newPassword, newPasswordConfirm } = req.body;

        const user = await profilDatamapper.account.getOneUser(id);
        const passwordHashFromDB = user.password;

        const isGoodPassword = await bcrypt.compare(
          oldPassword,
          passwordHashFromDB
        );
        if (!isGoodPassword) {
          next(
            new ApiError(
              userError.details,
              userError.message.passwordNotGood,
              null
            )
          );
          return;
        }

        if (oldPassword === newPassword) {
          next(
            new ApiError(
              userError.details,
              userError.message.samePAsswords,
              null
            )
          );
          return;
        }

        if (newPassword !== newPasswordConfirm) {
          next(
            new ApiError(
              userError.details,
              userError.message.passwordDontMatch,
              null
            )
          );
          return;
        }

        const hash = await hashPassword(newPassword);

        await profilDatamapper.account.savePassword(hash, id);

        res.status(200).json({ message: 'password update successfull' });
      } catch (error) {
        throw new ApiError(
          internalServerError.details,
          internalServerError.message.global,
          error
        );
      }
    },
    async delete(req, res, next) {
      try {
        const id = req.session.userId;

        const { password } = req.body;

        const user = await profilDatamapper.account.getOneUser(id);
        const passwordHashFromDB = user.password;

        const isGoodPassword = await bcrypt.compare(
          password,
          passwordHashFromDB
        );
        if (!isGoodPassword) {
          next(
            new ApiError(
              userError.details,
              userError.message.passwordNotGood,
              null
            )
          );
          return;
        }
        await profilDatamapper.account.delete(id);
        await profilDatamapper.account.deleteActivity(id);

        req.session.destroy((err) => {
          if (err) {
            console.error('Error destroying session ', err.message);
            return res
              .status(500)
              .json({ error: 'An error occurred while logging out' });
          }

          res.clearCookie('connect.sid', { path: '/' });
          res.status(200).json({ message: 'logged out successfully' });
        });
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
