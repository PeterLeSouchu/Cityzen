import axios from 'axios';
import client from '../../config/pg.client.js';

async function getAllFrenchCities() {
  try {
    const response = await axios.get(
      'https://geo.api.gouv.fr/communes?fields=nom,codePostal&format=json&geometry=centre&limit=34935'
    );

    const cities = response.data;
    return cities;
  } catch (error) {
    console.error('Erreur lors de la récupération des villes :', error);
  }
}

async function insertCity(city) {
  const { name, zip_code } = city;
  try {
    await client.query('INSERT INTO city (name, zip_code) VALUES ($1, $2)', [
      name,
      zip_code,
    ]);
    console.log(`Ville ${name} insérée`);
  } catch (error) {
    console.error("Erreur lors de l'insertion de la ville :", error);
  }
}

export async function main() {
  try {
    const cities = await getAllFrenchCities();
    console.log(cities);
    for (const city of cities) {
      await insertCity({
        name: city.nom,
        zip_code: city.code,
      });
    }
  } catch (error) {
    console.error(
      'Erreur lors de la récupération de toutes les villes :',
      error
    );
  }
}
