// insertData.js
import countries from './countryData.js';
import { connectDatabase } from './config.js';
import 'dotenv/config.js';

const test = process.env.PG_URL;
console.log(test);
async function insertCountry() {
  const client = await connectDatabase();

  try {
    for (const pays of countries) {
      const query = {
        text: 'INSERT INTO country(name) VALUES($1)',
        values: [pays.name],
      };
      await client.query(query);
      console.log(`Inserted: ${pays.name}`);
    }
  } catch (err) {
    console.error('Error inserting data', err.stack);
  } 
}

insertCountry();
