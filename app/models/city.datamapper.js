import client from "../config/pg.client.js";

const cityDatamapper = {
  async getOneByName(name) {
    const city = await client.query(`
     SELECT * FROM "city" 
      WHERE "name" = $1
    ;`, [name]);

    return city.rows[0];
  },

  async getOneById(id) {
    const city = await client.query(`
     SELECT * FROM "city" 
      WHERE "id" = $1
    ;`, [id]);

    return city.rows[0];
  },

  async findCity(city) {
    const citiesFounded = await client.query(`
      SELECT * FROM "city"
      	JOIN "zip_code"
		      ON "city"."id" = "zip_code"."id_city"
	      WHERE LOWER("city"."name") LIKE $1
      LIMIT 13;
     ;`, [city + '%']);
 
     return citiesFounded.rows;
  }
};

export default cityDatamapper;