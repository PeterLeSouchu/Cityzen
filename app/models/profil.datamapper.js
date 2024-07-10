import client from "../config/pg.client.js";

const profilDatamapper = {

  favorites : {
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


  }

};

export default profilDatamapper;