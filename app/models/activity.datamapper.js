// EXTERNAL MODULES
import client from "../config/pg.client.js";

const activityDatamapper = {
  // async getAll(endpointsArray) {

    

  //   const result = await client.query(`
  //     SELECT * FROM "activity" 
  //       WHERE "avg_raiting" ORDER
  //     ;`);

  //   return result.rows; 
  // }

  async getOne(id) {
    const result = await client.query(`
    SELECT * FROM "activity" 
      WHERE "id" = $1
    ;`, [id]);

    return result.rows;

  }
}

export default activityDatamapper;