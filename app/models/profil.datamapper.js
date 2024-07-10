import client from "../config/pg.client.js";

const profilDatamapper = {

  favorites: {
    async getOne(userId, activityId) {

      const userActivity = await client.query(`
      SELECT * FROM "favorite_activity"
        WHERE "id_user" = $1
        AND "id_activity" = $2
      ;`, [userId, activityId]);

      return userActivity.rows[0];
    },

    async getAll(userId) {
      const userActivities = await client.query(`
        SELECT * FROM "favorite_activity"
          WHERE "id_user" = $1
        ;`, [userId]);
  
      return userActivities.rows;
    },

    async saveFavorite(userId, activityId) {

      const savedActivity = await client.query(`
        INSERT INTO "favorite_activity" ("id_user", "id_activity")
          VALUES ($1, $2)
        RETURNING *;
      ;`, [userId, activityId]);

      return savedActivity.rows[0];
    },

    async removedFavorite(userId, activityId) {

      const removedActivity = await client.query(`
        DELETE FROM "favorite_activity"
          WHERE "id_user" = $1
          AND "id_activity" = $2
        RETURNING *;
      ;`, [userId, activityId]);

      return removedActivity.rows[0];
    }


  },

  activities: {
    async getAll(userId) {
      const userActivity = await client.query(`
      SELECT * FROM "activity"
        WHERE "id_user" = $1
      ;`, [userId]);

      return userActivity.rows;
    },

    async create(activity) {
      const { slug, url, title, description, image, address, phone, longitude, latitude, userId, cityId } = activity;

      const createdActivity = await client.query(`
        INSERT INTO "activity"("slug", "url", "title", "description", "url_image", "address", "phone", "longitude", "latitude", "id_user", "id_city")
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
        ;`, [slug, url, title, description, image, address, phone, longitude, latitude, userId, cityId]);
  
        return createdActivity.rows[0];
    }

  }

};

export default profilDatamapper;