// TIERCE MODULES
import 'dotenv/config';

// EXTERNAL MODULES

import ApiError from '../errors/api.error.js';
import activityDatamapper from '../models/activity.datamapper.js';
import cityDatamapper from '../models/city.datamapper.js';
import profilDatamapper from '../models/profil.datamapper.js';
import userActivityRatingDatamapper from '../models/user-activity-rating.datamapper.js';
import getCoordinates from '../utils/get-coordinate.js';
import bcrypt from 'bcrypt';
import { hashPassword } from '../utils/bcrypt.js';

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
          status: 404,
        });
        requestError.name = 'NotFound';

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

      res.status(201).json({ data: [existActivity] });
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
          status: 404,
        });
        requestError.name = 'NotFound';
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

      const removedFavorite = await profilDatamapper.favorites.removedFavorite(
        userId,
        activityId
      );

      res.status(200).json({ data: [existActivity] });
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
      const userId = req.session.userId;
      const { title, description, address, phone, city } = req.body;
      const imageUrl = req.file
        ? `${process.env.HOST}:${process.env.PORT}/uploads/${req.file.filename}`
        : null;
    
      // Generate the initial slug
      let slug = encodeURIComponent(`${title}-${city}`.toLowerCase().replace(/\s+/g, '-'));
    
      // Check if an activity with the same slug already exists
      const existingActivities = await activityDatamapper.getAllBySlug(slug);
      if (existingActivities.length > 0) {
        // Add a unique suffix to the slug to ensure its uniqueness
        slug += `-${existingActivities.length + 1}`;
      }
    
      // Find the city by name
      const cityFromDB = await cityDatamapper.getOneByName(city);
      
      // Get latitude and longitude from address using an external API
      const coordinates = await getCoordinates(address, cityFromDB.name);
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
    
      const createdActivity = await profilDatamapper.activities.create(activityToCreate);
    
      res.status(201).json({ data: [createdActivity] });
    },
    

    async update(req, res) {
      const userId = req.session.userId;
      const activityId = Number.parseInt(req.params.id, 10);
    
      // Check if the activity exists
      const existingActivity = await activityDatamapper.getOne(activityId);
      if (!existingActivity) {
        throw new ApiError("This activity doesn't exist", { status: 404 });
      }
    
      // Check if the activity was created by this user
      const userActivity = await profilDatamapper.activities.getOne(userId, activityId);
      if (!userActivity) {
        throw new ApiError('This activity was not created by this user', { status: 403 });
      }
    
      const { title, address, city } = req.body;
      const imageUrl = req.file
        ? `${process.env.HOST}:${process.env.PORT}/uploads/${req.file.filename}`
        : existingActivity.url_image;
    
      // Start with the existing slug, title, and city
      let slug = existingActivity.slug;
      let titleForSlug = existingActivity.title;
      let cityForSlug = (await cityDatamapper.getOneById(existingActivity.id_city)).name;
    
      // If title or city is updated, generate a new slug
      if (title || city) {
        titleForSlug = title || titleForSlug;
        cityForSlug = city || cityForSlug;
    
        slug = encodeURIComponent(`${titleForSlug}-${cityForSlug}`.toLowerCase().replace(/\s+/g, '-'));
        
        const existingActivitiesWithNewSlug = await activityDatamapper.getAllBySlug(slug);
        if (existingActivitiesWithNewSlug.length > 0) {
          slug += `-${existingActivitiesWithNewSlug.length + 1}`;
        }
      }
    
      const cityFromDB = city ? await cityDatamapper.getOneByName(city) : await cityDatamapper.getOneById(existingActivity.id_city);
    
      // Update latitude and longitude if city or address changes
      let { latitude, longitude } = existingActivity;
      if (city || address) {
        const coordinates = await getCoordinates(address, cityFromDB.name);
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
    
      const updatedActivity = await profilDatamapper.activities.update(activityToUpdate, activityId);
    
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
          { status: 404 }
        );
        requestError.name = 'NotFound';
        throw requestError;
      }

      // Check if activity is already saved ti the user's favorites
      const userHasActivity = await profilDatamapper.activities.getOne(
        userId,
        activityId
      );
      if (!userHasActivity) {
        const requestError = new ApiError(
          'This activity not created by this user',
          { status: 403 }
        );
        requestError.name = 'Forbidden';
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
          status: 404,
        });
        requestError.name = 'NotFound';
        throw requestError;
      }

      const userHasRateActivity = await userActivityRatingDatamapper.getOne(
        userId,
        activityId
      );
      if (!userHasRateActivity) {
        const requestError = new ApiError("The user don't rate this activity", {
          status: 404,
        });
        requestError.name = 'NotFound';
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
          status: 404,
        });
        requestError.name = 'NotFound';
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
          status: 404,
        });
        requestError.name = 'NotFound';
        throw requestError;
      }

      // Check if user has already rate this activity
      const userHasRateActivity = await userActivityRatingDatamapper.getOne(
        userId,
        activityId
      );
      if (!userHasRateActivity) {
        const requestError = new ApiError("The user don't rate this activity", {
          status: 404,
        });
        requestError.name = 'NotFound';
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
  account: {
    async updatePseudo(req, res) {
      const { newPseudo } = req.body;
      const id = req.session.userId;

      try {
        // Verification if user exist
        const user = await profilDatamapper.account.getOneUser(id);
        console.log(user.id);

        if (!user) {
          return res.status(404).json({ message: "User doesn't exist" });
        }

        // Verification if pseudo is tused
        const pseudoExist = await profilDatamapper.account.checkPseudo(
          newPseudo
        );

        if (pseudoExist) {
          return res.status(404).json({ message: 'pseudo already used' });
        }

        // Update pseudo
        await profilDatamapper.account.updatePseudo(newPseudo, id);

        res.status(200).json({ data: [newPseudo] });
      } catch (error) {
        console.log('Pseudo non changé');
        res.status(500).json({ message: 'Erreur serveur' });
      }
    },
    async updatePassword(req, res) {
      const id = req.session.userId;
      const { oldPassword, newPassword, newPasswordConfirm } = req.body;

      const user = await profilDatamapper.account.getOneUser(id);
      const passwordHashFromDB = user.password;

      const isGoodPassword = await bcrypt.compare(
        oldPassword,
        passwordHashFromDB
      );
      if (!isGoodPassword) {
        return res.status(400).json({ error: "Password doesn't correct" });
      }

      if (oldPassword === newPassword) {
        return res.status(400).json({ error: "Don't use same password" });
      }

      if (newPassword !== newPasswordConfirm) {
        return res.status(400).json({ error: "passwords don't match" });
      }

      const hash = await hashPassword(newPassword);

      await profilDatamapper.account.savePassword(hash, id);

      res.status(200).json({ message: 'password update successfull' });
    },
    async delete(req, res) {
      const id = req.session.userId;
      console.log(id);
      const { password } = req.body;

      const user = await profilDatamapper.account.getOneUser(id);
      const passwordHashFromDB = user.password;

      const isGoodPassword = await bcrypt.compare(password, passwordHashFromDB);
      if (!isGoodPassword) {
        return res.status(400).json({ error: "Password doesn't correct" });
      }
      await profilDatamapper.account.delete(id);
      console.log('fekelfellelfe,fekfelflefe,fnefjne');

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
    },
  },
};

export default profilController;
