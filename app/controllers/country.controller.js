import countryDatamapper from "../models/country.datamapper.js";

const countryController = {
  async index(req, res) {
    try {
      const { country } = req.params;

      const countries = await countryDatamapper.findCountry(
        country,
      );

      if (!countries || countries.length === 0) {
        return res
          .status(404)
          .json({ message: `${country} not found` });
      }

      res.status(200).json({data: countries});

    } catch (error) {
      console.error('Error in countryController: index method', error.message);

      const requestError = new ApiError("Country not found", error);
      requestError.name = 'BadRequest';
      requestError.status = 400;

      throw requestError;
    }
  },
};

export default countryController;
