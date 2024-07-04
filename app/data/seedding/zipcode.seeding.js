/**
 * 
 * @param {*} city 
 */
async function insertZipCode(city) {
  try {
    const zipCodeArray = city.codesPostaux;

    for(const zipCode of zipCodeArray) {
      const query = {
        text: `BEGIN;
        INSERT INTO "zip_code"("zip_code", "id_city") VALUES($1, $2);
        COMMIT;`,
        values: [zipCode, city.id], 
      };
    }
    
  } catch (err) {
    console.error('Error inserting zipcode:',err);
  }
}

export {
  insertZipCode,
}