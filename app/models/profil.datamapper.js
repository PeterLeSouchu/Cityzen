const profilDatamapper = {

  async saveFavorite(activityId, userId) {


    const savedActivity = await client.query(`
      INSERT INTO "favorite_activity"
        VALUES ($1, $2)
      RETURNING *;
    ;`, [activityId, userId]);
  }

};

export default profilDatamapper;