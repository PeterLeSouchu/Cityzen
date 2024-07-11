import dataMapper from "../dataMapper/CityDataMapper.js";

const cityController = {
  async index(req, res) {
    try {
      const { city } = req.params;

      const countries = await dataMapper.findCity(
        city,
      );

      if (!countries || countries.length === 0) {
        return res
          .status(404)
          .json({ message: `No ${city} found` });
      }

      res.status(200).json(countries);
    } catch (error) {
      console.error('Error in cityController: index method', error.message);
      res.status(500).json({ error: 'An error occurred' });
    }
  },
};

export default cityController;
