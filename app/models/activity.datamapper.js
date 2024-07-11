// EXTERNAL MODULES
import client from "../config/pg.client.js";

const activityDatamapper = {
  async getOne(id) {
    const result = await client.query(`
    SELECT * FROM "activity" 
      WHERE "id" = $1
    ;`, [id]);

    return result.rows[0];
  },

  async getByTitle(title) {
    const result = await client.query(`
    SELECT * FROM "activity" 
      WHERE "title" = $1
    ;`, [title]);

    return result.rows[0];
  },

  async getAllBySlug(slug) {
    const result = await client.query(`
      SELECT * FROM "activity"
        WHERE "slug" ILIKE $1  
    ;`, [slug + '%'])

    return result.rows;
  },

  async getRecent() {
    const result = await client.query(`
    SELECT * FROM "activity"
      ORDER BY "created_at" DESC
      LIMIT 10 
    ;`);

    return result.rows;
  },

  async findActivitiesRating() {
    const result = await client.query(`
    SELECT * FROM "activity"
      ORDER BY "avg_rating" DESC
      LIMIT 10
    ;`);

    return result.rows;
  },

  async findActivityOfCity(country, city) {
    const result = await client.query(`
    SELECT * FROM "country"
      JOIN "city" ON "country".id = "city"."id_country"
      JOIN "activity" ON "city".id = "activity"."id_city"
        WHERE "country".name = $1
        AND "city".name = $2
    ;`, [country, city]);

    return result.rows;
  },

}

export default activityDatamapper;