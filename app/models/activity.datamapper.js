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
  }

}

export default activityDatamapper;