import { insertZipCode } from "./zipcode.seeding.js";

/**
 * 
 * @param {*} departmentCode 
 * @returns 
 */
async function fetchCitiesFromDepartement(departmentCode) {
  const API_CITY_URL = `https://geo.api.gouv.fr/departements/${departmentCode}/communes`;
  console.log('departmentCode', departmentCode);
  const citiesFromDepartment = await fetch(API_CITY_URL)
    .then(response => response.json())
    .then(data => {
      console.log(data.length,'est envoyé');
     return data;
    })
  .catch(err => console.log('Erreur dans le fetch cities', err));
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
      console.log('departement.code', department.code)
      for (const city of citiesFromDepartment) {
        const query = {
          text: `INSERT INTO "city"("name", "id_department", "id_country") VALUES($1, $2, $3) RETURNING *;`,
          values: [city.nom, department.id, country.id], 
        };
      
        const returningQuery = await client.query(query);
        const insertedCity = returningQuery.rows[0]
        console.log('insertedCity effectué');

        const insertedZipCode = await insertZipCode(client, city, insertedCity.id); 
      }

  } catch (err) {
    console.error('Error inserting cities:',err);
  }
}

async function getCity(client, cityName ) {
  console.log(cityName);
  const city = await client.query(`
  SELECT * FROM "city"
    WHERE "name" = $1
  ;`, [cityName]);

  return city.rows[0];
}

export {
  fetchCitiesFromDepartement,
  insertCities,
  getCity,
}