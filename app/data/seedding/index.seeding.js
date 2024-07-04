import client from "../../config/pg.client.js";
import countries from "./country.data.js";

import { fetchCitiesFromDepartement, insertCities } from "./city.seeding.js";
import { getCountryFromDB, insertCountries } from "./country.seeding.js";
import { fetchDepartments, getDepartmentsFromDB, insertDepartments } from "./department.seeding.js";



const API_DEP_URL = 'https://geo.api.gouv.fr/departements';

// 1- Insert all countries into DB
insertCountries(client,countries)
console.log('countries inserted');

// 2- Insert all departments into DB
const allDepartmentsFromAPI = fetchDepartments(API_DEP_URL);
insertDepartments(client, allDepartmentsFromAPI);
console.log('departments inserted');


// 3- Insert all cities from one department into DB
const country = getCountryFromDB('france');
const allDepartments = getDepartmentsFromDB(client);
allDepartments.forEach(department => {
  const citiesFromDepartment = fetchCitiesFromDepartement(department.code);
  insertCities(client, country, department, citiesFromDepartment)
});
console.log('cities inserted');


// 4- Insert activities