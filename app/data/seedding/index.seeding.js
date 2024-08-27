import client from '../../config/pg.client.js';

import { getCity } from './city.seeding.js';
import { main } from './peter.seeding.js';

import {
  fetchActivitiesFromCity,
  formatingActivity,
  insertActivityFromCity,
} from './activities.seeding.js';
import { getOneUser, insertUser } from './user.seeding.js';

// 1 insert all cities in France
await main();

await insertUser(client, 'cityzen@cityzen.com', 'Cityzen.1', 'Cityzen');
const cityToSearch = 'Perpignan';
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
  await insertActivityFromCity(client, formatedActivity);
}
