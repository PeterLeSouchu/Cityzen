// EXTERNAL MODULES
import client from "../config/pg.client";

const activityDatamapper = {
  async getAll(endpointsArray) {

    

    const result = await client.query(`
      SELECT * FROM "activity" 
        WHERE "avg_raiting" ORDER
      ;`);

    return result.rows; 
  }

}

export default activityDatamapper;