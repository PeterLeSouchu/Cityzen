import dataMapper from "../dataMapper/CountryDataMapper.js";

const countryController = {
  async index(req, res) {
    try {
      const { country } = req.params;

      const countries = await dataMapper.findCountry(
        country,
      );

      if (!countries || countries.length === 0) {
        return res
          .status(404)
          .json({ message: `No ${country} found` });
      }

      res.status(200).json(countries);
    } catch (error) {
      console.error('Error in countryController: index method', error.message);
      res.status(500).json({ error: 'An error occurred' });
    }
  },
};

export default countryController;
