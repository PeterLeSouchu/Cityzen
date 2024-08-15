import client from "../config/pg.client.js";

const countryDatamapper = {
  async findCountry(country) {
    const countriesFounded = await client.query(`
      SELECT * FROM "country" 
       WHERE LOWER(name) LIKE $1
      LIMIT 5
     ;`, [country + '%']);
 
     return countriesFounded.rows;
  }
}

export default countryDatamapper;