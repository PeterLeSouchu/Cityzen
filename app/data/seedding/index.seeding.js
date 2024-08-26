import client from '../../config/pg.client.js';

import { getCity } from './city.seeding.js';
import { main } from './peter.seeding.js';

import {
  fetchActivitiesFromCity,
  formatingActivity,
  insertActivityFromCity,
} from './activities.seeding.js';
import { getOneUser, insertUser } from './user.seeding.js';

await main();

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
