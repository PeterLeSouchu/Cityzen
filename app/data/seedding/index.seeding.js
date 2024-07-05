import client from "../../config/pg.client.js";
import countries from "./country.data.js";

import { fetchCitiesFromDepartement, insertCities } from "./city.seeding.js";
import { getCountryFromDB, insertCountries } from "./country.seeding.js";
import { fetchDepartments, getDepartmentsFromDB, insertDepartments } from "./department.seeding.js";



const API_DEP_URL = 'https://geo.api.gouv.fr/departements';

// 1- Insert all countries into DB
await insertCountries(client,countries)
console.log('countries inserted');

// 2- Insert all departments into DB
const allDepartmentsFromAPI = await fetchDepartments(API_DEP_URL);
await insertDepartments(client, allDepartmentsFromAPI);
console.log('departments inserted');



// 3- Insert all cities from one department into DB
const country = await getCountryFromDB(client, 'France');
const allDepartments = await getDepartmentsFromDB(client);

for (const department of allDepartments) {
  const citiesFromDepartment = await fetchCitiesFromDepartement(department.code);

  await insertCities(client, country, department, citiesFromDepartment);
}


// DEPARTMENTS TESTS
// for(let i = 10; i <= 95; i++) {
//   try {
//     const citiesFromDepartment = await fetchCitiesFromDepartement(i);
//   } catch (error) {
//     console.log(error);
//     console.log(i);
//   }
// }

// 4- Insert activities