import errors from '../errors/errors.js';
import cityDatamapper from '../models/city.datamapper.js';
import ApiError from '../errors/api.error.js';

const { cityError, internalServerError } = errors;

const cityController = {
  async index(req, res, next) {
    try {
      const { city } = req.params;

      const cities = await cityDatamapper.findCity(city.toLowerCase());

      if (!cities || cities.length === 0) {
        next(new ApiError(cityError.details, cityError.message.notFound, null));
        return;
      }

      res.status(200).json({ data: cities });
    } catch (error) {
      throw new ApiError(
        internalServerError.details,
        internalServerError.message.global,
        error
      );
    }
  },
};

export default cityController;
