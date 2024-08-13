// EXTERNAL MODULES
import client from '../config/pg.client.js';

const userDatamapper = {
  async save(email, hash, pseudo) {
    const response = await client.query(
      `
      INSERT INTO "user"("email", "password", "pseudo")
        VALUES ($1, $2, $3)
      RETURNING *
      ;`,
      [email, hash, pseudo]
    );
    console.log(response.rows);

    return response.rows[0];
  },

  async show(email) {
    const response = await client.query(
      `
      SELECT * FROM "user" 
        WHERE "email" = $1
      ;`,
      [email]
    );
    return response.rows[0];
  },
};

export default userDatamapper;
