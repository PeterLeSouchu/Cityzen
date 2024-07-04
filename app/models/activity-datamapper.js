const activityDatamapper = {
  async getAll(endpointsArray) {


    const result = await client.query(`SELECT * FROM "activity";`);

    return result.rows; 
  }

}

export default activityDatamapper;