import client from '../../config/pg.client.js';
import countries from './country.data.js';

import {
  fetchCitiesFromDepartement,
  getCity,
  insertCities,
} from './city.seeding.js';
import { getCountryFromDB, insertCountries } from './country.seeding.js';
import {
  fetchDepartments,
  getDepartmentsFromDB,
  insertDepartments,
} from './department.seeding.js';
import {
  fetchActivitiesFromCity,
  formatingActivity,
  insertActivityFromCity,
} from './activities.seeding.js';
import { insertRating } from './rating.seeding.js';
import { getOneUser, insertUser } from './user.seeding.js';

const API_DEP_URL = 'https://geo.api.gouv.fr/departements';

// 1- Insert all countries into DB
await insertCountries(client, countries);
console.log('Countries inserted');

// 2- Insert all departments into DB
const allDepartmentsFromAPI = await fetchDepartments(API_DEP_URL);
await insertDepartments(client, allDepartmentsFromAPI);
console.log('Departments inserted');

// 3- Insert all cities from one department into DB
const country = await getCountryFromDB(client, 'France');
const allDepartments = await getDepartmentsFromDB(client);

for (const department of allDepartments) {
  const citiesFromDepartment = await fetchCitiesFromDepartement(
    department.code
  );
  await insertCities(client, country, department, citiesFromDepartment);
}

// 4- Insert user
await insertUser(client, 'cityzen@cityzen.com', 'Cityzen.1', 'Cityzen');

// 5 - Insert activities
const cityToSearch = 'Perpignan';
// const cityToSearch = 'Paris'; 27083, 4343, 18550, 13390, 12355, 22123
const user = await getOneUser(client);
const activitiesFromApi = await fetchActivitiesFromCity(cityToSearch);
const city = await getCity(client, cityToSearch);

for (const activity of activitiesFromApi) {
  const formatedActivity = await formatingActivity(
    client,
    activity,
    city.id,
    user.id
  );
  // console.log(formatedActivity);
  await insertActivityFromCity(client, formatedActivity);
}

// 6- Insert rating
const ratings = [1, 2, 3, 4, 5];

for (const rating of ratings) {
  await insertRating(client, rating);
}
