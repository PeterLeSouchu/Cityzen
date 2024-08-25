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
        SELECT 
          "favorite_activity"."id" AS "id_favorite",
          "favorite_activity"."id_user",
          "favorite_activity"."id_activity",
          "favorite_activity"."created_at" AS "created_at_favorite",
          "favorite_activity"."updated_at" AS "updated_at_favorite",
          "activity"."id",
          "activity"."slug",
          "activity"."title",
          "activity"."description",
          "activity"."url_image",
          "activity"."address",
          "activity"."phone",
          "activity"."avg_rating",
          "activity"."latitude",
          "activity"."longitude",
          "activity"."id_user" AS "id_created_user",
          "activity"."id_city",
          "activity"."created_at" AS "created_at_activity",
          "activity"."updated_at" AS "updated_at_activity"
        FROM "favorite_activity" 
          JOIN "activity" 
            ON "favorite_activity"."id_activity" = "activity"."id"
          WHERE "favorite_activity"."id_user" = $1;`,
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
      INSERT INTO "activity"("slug", "title", "description", "url_image", "address", "phone", "longitude", "latitude", "id_user", "id_city")
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
      ;`,
        [
          slug,
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
      const columns = Object.keys(activity);
      const values = Object.values(activity);
      console.log(activity);

      const columnsScriptSQL = columns.map((column, index) => {
        if (column === 'cityId') {
          return `"id_city" = $${index + 1}`;
        }

        if (column === 'image') {
          return `"url_image" = $${index + 1}`;
        }

        return `"${column}" = $${index + 1}`;
      });

      const result = await client.query(
        `
      UPDATE "activity"
        SET ${columnsScriptSQL}, updated_at = CURRENT_TIMESTAMP
        WHERE "id" = $${columnsScriptSQL.length + 1}
      RETURNING *
      ;`,
        [...values, activityId]
      );

      return result.rows[0];
    },

    async removeActivity(userId, activityId) {
      const result = await client.query(
        `
        DELETE FROM "activity"
          WHERE "id_user" = $1
          AND "id" = $2
        RETURNING *;
      ;`,
        [userId, activityId]
      );

      return result.rows[0];
    },
  },

  ratings: {
    async getAllActivities(userId) {
      const result = await client.query(
        `
        SELECT 
          "user_activity_rating"."id" AS "id_user_rating",
          "user_activity_rating"."id_user",
          "user_activity_rating"."id_activity",
          "user_activity_rating"."id_rating",
          "user_activity_rating"."created_at" AS "created_at_rating",
          "user_activity_rating"."updated_at" AS "updated_at_rating",
          "user_activity_rating"."updated_at" AS "updated_at_rating",
          "activity"."id",
          "activity"."slug",
          "activity"."title",
          "activity"."description",
          "activity"."url_image",
          "activity"."address",
          "activity"."phone",
          "activity"."avg_rating",
          "activity"."latitude",
          "activity"."longitude",
          "activity"."id_user" AS "id_created_user",
          "activity"."id_city",
          "activity"."created_at" AS "created_at_activity",
          "activity"."updated_at" AS "updated_at_activity"
        FROM "user_activity_rating"
          JOIN "activity"
            ON "user_activity_rating"."id_activity" = "activity"."id"
          WHERE "user_activity_rating"."id_user" = $1
        ;`,
        [userId]
      );

      return result.rows;
    },

    async getAvg(userId) {
      const result = await client.query(
        `
        SELECT AVG("user_activity_rating"."id_rating") FROM "user_activity_rating"
          JOIN "activity"
            ON "user_activity_rating"."id_activity" = "activity"."id"
          WHERE "user_activity_rating"."id_user" = $1
        ;`,
        [userId]
      );

      return result.rows[0].avg;
    },

    async saveRating(userId, activityId, userRating) {
      const result = await client.query(
        `
      INSERT INTO "user_activity_rating"("id_user", "id_activity", "id_rating")
      VALUES($1, $2, $3)
      RETURNING *
      ;`,
        [userId, activityId, userRating]
      );

      await client.query(
        `
      INSERT INTO "user_rating"("id_user", "id_rating")
      VALUES($1, $2)
      RETURNING *
      ;`,
        [userId, userRating]
      );

      await client.query(
        `
      INSERT INTO "rating_activity"("id_activity", "id_rating")
      VALUES($1, $2)
      RETURNING *
      ;`,
        [activityId, userRating]
      );

      // Mettre à jour la note moyenne SEULEMENT pour les activités créées par les utilisateurs cityZen

      return result.rows[0];
    },

    async updateRating(userId, activityId, userRating, oldUserRating) {
      const result = await client.query(
        `
      UPDATE "user_activity_rating"
        SET "id_rating" = $1
          WHERE "id_user" = $2
          AND "id_activity" = $3
      RETURNING *
      ;`,
        [userRating, userId, activityId]
      );

      await client.query(
        `
      UPDATE "user_rating"
        SET "id_rating" = $1
          WHERE "id" IN (
            SELECT "id" FROM "user_rating" 
              WHERE "id_user" = $2 
              AND "id_rating" = $3
            LIMIT 1
          )
      RETURNING *
      ;`,
        [userRating, userId, oldUserRating]
      );

      await client.query(
        `
      UPDATE "rating_activity"
       SET "id_rating" = $1
          WHERE "id" IN (
            SELECT "id" FROM "rating_activity" 
              WHERE "id_activity" = $2 
              AND "id_rating" = $3
            LIMIT 1
          )
      RETURNING *
      ;`,
        [userRating, activityId, oldUserRating]
      );

      // Mettre à jour la note moyenne SEULEMENT pour les activités créées par les utilisateurs cityZen

      return result.rows[0];
    },
  },
  account: {
    async getOneUser(userId) {
      const result = await client.query(
        `
        SELECT * FROM "user"
          WHERE "id" = $1;`,
        [userId]
      );

      return result.rows[0];
    },
    async updatePseudo(pseudo, userId) {
      const result = await client.query(
        `
        UPDATE "user"
          SET "pseudo" = $1
            WHERE "id" = $2
        RETURNING *
        ;`,
        [pseudo, userId]
      );

      return result.rows[0];
    },
    async checkPseudo(pseudo) {
      const result = await client.query(
        `
        SELECT * FROM "user"
          WHERE "pseudo" = $1;`,
        [pseudo]
      );

      return result.rows[0];
    },
    async savePassword(password, id) {
      await client.query(
        `
        UPDATE "user"
          SET "password" = $1
            WHERE "id" = $2
        ;`,
        [password, id]
      );
    },
    async delete(id) {
      await client.query(
        `
        DELETE FROM "user"
          WHERE "id" = $1
        RETURNING *
        ;`,
        [id]
      );
    },
    async deleteActivity(id) {
      await client.query(
        `
        DELETE FROM "activity"
          WHERE "id_user" = $1
        RETURNING *
        ;`,
        [id]
      );
    },
  },
};

export default profilDatamapper;
