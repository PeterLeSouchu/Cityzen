import cityDatamapper from "../models/city.datamapper.js";

const cityController = {
  async index(req, res) {
    try {
      const { city } = req.params;

      const cities = await cityDatamapper.findCity(
        city.toLowerCase(),
      );

      if (!cities || cities.length === 0) {
        return res
          .status(404)
          .json({ message: `${city} not found` });
      }

      console.log(cities);

      res.status(200).json({ data: cities});

    } catch (error) {
      console.error('Error in cityController: index method', error.message);

      const requestError = new ApiError("City not found", error);
      requestError.name = 'BadRequest';
      requestError.status = 400;

      throw requestError;
    }
  },
};

export default cityController;
