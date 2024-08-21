import client from '../config/pg.client.js';

const dataMapper = {
  async findCity(city) {
    const query = {
      text: `SELECT * FROM city WHERE LOWER(name) LIKE $1 LIMIT 10`,
      values: [`${city.toLowerCase()}%`],
    };
    const result = await client.query(query);
    const { rows } = result;
    return rows;
  },
};

export default dataMapper;
