// EXTERNAL MODULES
import client from "../config/pg.client.js";

const userActivityRatingDatamapper = {

  async getOne(userId, activityId) {
    const userRatingForActivity = await client.query(`
    SELECT * FROM "user_activity_rating"
      WHERE "id_user" = $1
      AND "id_activity" = $2
    ;`, [userId, activityId]);

    return userRatingForActivity.rows[0];
  },

};

export default userActivityRatingDatamapper;