import client from "../config/pg.client.js";

const profilDatamapper = {

  async saveFavorite(activityId, userId) {


    const savedActivity = await client.query(`
      INSERT INTO "favorite_activity" ("id_user", "id_activity")
        VALUES ($1, $2)
      RETURNING *;
    ;`, [userId, activityId]);
  }

};

export default profilDatamapper;