import client from "../../config/pg.client.js";

/**
 * 
 * @param {*} city 
 */
async function insertZipCode(client, city, cityId) {
  try {
    const zipCodeArray = city.codesPostaux;

    // console.log(city, cityId, zipCodeArray);

    for(const zipCode of zipCodeArray) {
      const query = {
        text: `INSERT INTO "zip_code"("zip_code", "id_city") VALUES($1, $2);`,
        values: [zipCode, cityId], 
      };

      const returningQuery = await client.query(query);
      console.log('insertedZipCode effectué');
    }
    
  } catch (err) {
    console.error('Error inserting zipcode:', err);
  }
}

export {
  insertZipCode,
}