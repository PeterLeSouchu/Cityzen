import client from '../config/pg.client.js';

const profilDatamapper = {
  favorites: {
    async getOne(userId, activityId) {
      const result = await client.query(
        `
      SELECT * FROM "favorite_activity"
        WHERE "id_user" = $1
        AND "id_activity" = $2
      ;`,
        [userId, activityId]
      );

      return result.rows[0];
    },

    async getAll(userId) {
      const result = await client.query(
        `
        SELECT * FROM "favorite_activity" JOIN "activity" ON "favorite_activity".id_activity = "activity".id WHERE "favorite_activity"."id_user" = $1;`,
        [userId]
      );

      return result.rows;
    },

    async saveFavorite(userId, activityId) {
      const result = await client.query(
        `
        INSERT INTO "favorite_activity" ("id_user", "id_activity")
          VALUES ($1, $2)
        RETURNING *;
      ;`,
        [userId, activityId]
      );

      return result.rows[0];
    },

    async removedFavorite(userId, activityId) {
      const result = await client.query(
        `
        DELETE FROM "favorite_activity"
          WHERE "id_user" = $1
          AND "id_activity" = $2
        RETURNING *;
      ;`,
        [userId, activityId]
      );

      return result.rows[0];
    },
  },

  activities: {
    async getAll(userId) {
      const result = await client.query(
        `
      SELECT * FROM "activity"
        WHERE "id_user" = $1
      ;`,
        [userId]
      );

      return result.rows;
    },

    async getOne(userId, activityId) {
      const result = await client.query(
        `
        SELECT * FROM "activity"
          WHERE "id_user" = $1
          AND "id" = $2
        ;`,
        [userId, activityId]
      );

      return result.rows[0];
    },

    async create(activity) {
      const {
        slug,
        url,
        title,
        description,
        image,
        address,
        phone,
        longitude,
        latitude,
        userId,
        cityId,
      } = activity;

      const result = await client.query(
        `
      INSERT INTO "activity"("slug", "url", "title", "description", "url_image", "address", "phone", "longitude", "latitude", "id_user", "id_city")
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      ;`,
        [
          slug,
          url,
          title,
          description,
          image,
          address,
          phone,
          longitude,
          latitude,
          userId,
          cityId,
        ]
      );

      return result.rows[0];
    },

    async update(activity, activityId) {
      // const { slug, url, title, description, image, address, phone, longitude, latitude, cityId } = activity;
      // console.log(activity);

      const columns = Object.keys(activity);
      // console.log(columns);
      const values = Object.values(activity);
      // console.log(values);

      const columnsScriptSQL = columns.map((column, index) => {
        if(column === "cityId") {
          return `"id_city" = $${index + 1}`
        }

        if(column === "image") {
          return `"url_image" = $${index + 1}`
        }

        return `"${column}" = $${index + 1}`
      })

      const result = await client.query(`
      UPDATE "activity"
        SET ${columnsScriptSQL}
        WHERE "id" = $${columnsScriptSQL.length + 1}
      RETURNING *
      ;`, [...values, activityId]);

      return result.rows[0];
    },

    async removeActivity(userId, activityId) {
      
      const result = await client.query(`
        DELETE FROM "activity"
          WHERE "id_user" = $1
          AND "id" = $2
        RETURNING *;
      ;`, [userId, activityId]);

      return result.rows[0];
    }

  },

  ratings: {
    async getAllActivities(userId) {
      const result = await client.query(`
        SELECT * FROM "user_activity_rating"
          JOIN "activity"
            ON "user_activity_rating"."id_activity" = "activity"."id"
          WHERE "user_activity_rating"."id_user" = $1
        ;`, [userId]);
  
        return result.rows;
    },

    async getAvg(userId) {
      const result = await client.query(`
        SELECT AVG("user_activity_rating"."id_rating") FROM "user_activity_rating"
          JOIN "activity"
            ON "user_activity_rating"."id_activity" = "activity"."id"
          WHERE "user_activity_rating"."id_user" = $1
        ;`, [userId]);
  
        return result.rows[0];
    },

    async saveRating(userId, activityId, userRating) {
      const result = await client.query(`
      INSERT INTO "user_activity_rating"("id_user", "id_activity", "id_rating")
      VALUES($1, $2, $3)
      RETURNING *
      ;`, [userId, activityId, userRating]);

      await client.query(`
      INSERT INTO "user_rating"("id_user", "id_rating")
      VALUES($1, $2)
      RETURNING *
      ;`, [userId, userRating]);

      await client.query(`
      INSERT INTO "rating_activity"("id_activity", "id_rating")
      VALUES($1, $2)
      RETURNING *
      ;`, [activityId, userRating]);

      // Mettre à jour la note moyenne SEULEMENT pour les activités créées par les utilisateurs cityZen

      return result.rows[0];
    },
  }
};

export default profilDatamapper;
