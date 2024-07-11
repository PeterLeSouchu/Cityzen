import client from '../config/pg.client.js'

const dataMapper = {
    async findCountry(country) {
        const query = {
          text: `SELECT * FROM country WHERE LOWER(name) LIKE $1 LIMIT 5`,
          values: [`${country.toLowerCase()}%`]
        }
        const result = await client.query(query);
        const {rows} = result;
        return rows;
        
      },
};

export default dataMapper;
