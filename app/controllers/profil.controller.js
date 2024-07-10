import ApiError from '../errors/api.error.js';
import activityDatamapper from '../models/activity.datamapper.js';
import cityDatamapper from '../models/city.datamapper.js';
import profilDatamapper from '../models/profil.datamapper.js';
import makeSlug from '../utils/make-slug.js';

const profilController = {
  RADIX_NUMBER: 10,

  favorites: {
    async index(req, res) {
      // const userId = req.cookies.userId;
      const userId = req.session.userId;

      const activities = await profilDatamapper.favorites.getAll(userId);

      console.log(`voici les activités favorites de l'user : ${activities}`);
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
        const requestError = new ApiError("This activity doesn't exist", {
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

      // const { title, description, image, address, phone, longitude, latitude, city } = req.body;

      // // This real slug but now we use the id at the place of the title
      // const slug = makeSlug(title);
      // // const slug =
      // const userId = req.cookies.userId;

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
        const requestError = new ApiError("This activity doesn't exist", {
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
      const userId = req.session.userId;

      const activities = await profilDatamapper.activities.getAll(userId);

      res.status(200).json({ data: activities });
    },

    async store(req, res) {
      const userId = req.session.userId;
      const {
        title,
        description,
        url,
        image,
        address,
        phone,
        longitude,
        latitude,
        city,
      } = req.body;

      // Faire le slug
      let slug = encodeURIComponent(title.toLowerCase());
      const sameActivityExist = await activityDatamapper.getAllBySlug(slug);
      if (sameActivityExist) {
        slug += `%20${city.toLowerCase()}`;
      }

      const sameActivityExistWithCity = await activityDatamapper.getAllBySlug(
        slug
      );
      console.log(sameActivityExistWithCity);
      if (sameActivityExistWithCity.length > 0) {
        const numberOfActivities = sameActivityExistWithCity.length;
        slug += `%20${numberOfActivities + 1}`;
      }

      const cityFromDB = await cityDatamapper.getOneByName(city);

      const activityToCreate = {
        slug,
        url,
        title,
        description,
        image,
        address,
        phone,
        longitude,
        latitude,
        userId,
        cityId: cityFromDB.id,
      };

      const createdActivity = await profilDatamapper.activities.create(
        activityToCreate
      );

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
        const requestError = new ApiError('This activity already exist', {
          status: 400,
        });
        requestError.name = 'BadRequest';
        throw requestError;
      }

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

      // const { title, description, url, image, address, phone, latitude, longitude, city } = req.body;
      const { title, city } = req.body;

      let slug = '';

      if (title || city) {
        // Faire le slug
        slug = encodeURIComponent(title.toLowerCase());
        const sameActivityExist = await activityDatamapper.getAllBySlug(slug);
        if (sameActivityExist) {
          slug += `%20${city.toLowerCase()}`;
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

      console.log(slug);

      const cityFromDB = await cityDatamapper.getOneByName(city);

      // const activityToUpdate = {
      //   slug,
      //   url,
      //   title,
      //   description,
      //   image,
      //   address,
      //   phone,
      //   longitude,
      //   latitude,
      //   cityId: cityFromDB.id,
      // };

      const activityToUpdate = {
        ...req.body,
        slug,
        title,
        cityId: cityFromDB.id,
      };
      delete activityToUpdate.city;

      const updatedActivity = await profilDatamapper.activities.update(
        activityToUpdate
      );

      res.status(200).json({ data: 'ok' });
      // res.status(200).json({data: [updatedActivity]});
    },

    async destroy(req, res) {
      const userId = req.session.userId;
      const activityId = Number.parseInt(
        req.params.id,
        profilController.RADIX_NUMBER
      );
    },
  },
};

export default profilController;
