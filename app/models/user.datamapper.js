// EXTERNAL MODULES
import client from "../config/pg.client.js";


const userDatamapper = {
  async save(email, hash, pseudo) {

    const response = await client.query(`
      INSERT INTO "user"("email", "password", "pseudo")
        VALUES ($1, $2, $3)
      RETURNING *
      ;`, [email, hash, pseudo])
    ;

    console.log(response.rows);

    return response.rows;

  }

}

export default userDatamapper;