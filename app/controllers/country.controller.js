import errors from '../errors/errors.js';
import countryDatamapper from '../models/country.datamapper.js';
import ApiError from '../errors/api.error.js';

const { internalServerError, countryError, cityError } = errors;

const countryController = {
  async index(req, res, next) {
    try {
      const { country } = req.params;

      const countries = await countryDatamapper.findCountry(
        country.toLowerCase()
      );

      if (!countries || countries.length === 0) {
        next(
          new ApiError(countryError.details, cityError.message.notFound, null)
        );
        return;
      }

      res.status(200).json({ data: countries });
    } catch (error) {
      throw new ApiError(
        internalServerError.details,
        internalServerError.message.global,
        error
      );
    }
  },
};

export default countryController;
