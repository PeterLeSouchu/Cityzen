
/**
 * 
 * @param {*} departmentCode 
 * @returns 
 */
async function fetchCitiesFromDepartement(departmentCode) {
  const API_CITY_URL = `https://geo.api.gouv.fr/departements/${departmentCode}/communes`;
  const citiesFromDepartment = fetch(API_CITY_URL)
    .then(response => response.json())
    .then(data)
  .catch(err => console.log(err));
  /*
 [
    {
      "nom": "Aubervilliers",
      "code": "93001",
      "codeDepartement": "93",
      "siren": "219300019",
      "codeEpci": "200054781",
      "codeRegion": "11",
      "codesPostaux": [
        "93300"
      ],
      "population": 90071
    },
    {
      "nom": "Aulnay-sous-Bois",
      "code": "93005",
      "codeDepartement": "93",
      "siren": "219300050",
      "codeEpci": "200054781",
      "codeRegion": "11",
      "codesPostaux": [
        "93600"
      ],
      "population": 86135
    },
  ]
  */

  return citiesFromDepartment;
}

/**
 * 
 * @param {*} client 
 * @param {*} country 
 * @param {*} department 
 * @param {*} citiesFromDepartment 
 */
async function insertCities(client, country, department, citiesFromDepartment) {
  try {
    for (const city of citiesFromDepartment) {
      const zipCodeArray = city.codesPostaux;

      const query = {
        text: `BEGIN;
        INSERT INTO "city"("name", "id_department", "id_country") VALUES($1, $2, $3);
        COMMIT;`,
        values: [city.nom, department.id, country.id], 
      };
    
      const insertedCity = await client.query(query);

      const insertedZipCode = insertZipCode(insertedCity); 
    }

  } catch (err) {
    console.error('Error inserting cities:',err);
  }
}

export {
  fetchCitiesFromDepartement,
  insertCities,
}