
/**
 * 
 * @param {*} client 
 * @param {*} countries 
 */
async function insertCountries(client, countries) {
  try {
    for (const country of countries) {
      const query = {
        text: `INSERT INTO "country"("name") VALUES($1);`,
        values: [country.name],
      };
      
      const result = await client.query(query);
      console.log(`Inserted: ${result}`);
    }

  } catch (err) {
    console.error('Error inserting data', err.stack);
  } 
};

/**
 * 
 * @param {*} country 
 * @returns 
 */
async function getCountryFromDB(client, countryDB) {
  // Get ID from country
  const data = await client.query(`SELECT * FROM "country" WHERE "name" = '${countryDB}'`);
  const country = data.rows[0];

  if (!country?.id) {
    throw new Error("Error: France not found in country list");
  }

  console.log("ID du pays France :", country.id);

  return country;
}

export {
  insertCountries,
  getCountryFromDB,
}