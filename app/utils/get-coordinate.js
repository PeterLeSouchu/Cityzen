import 'dotenv/config';

const API_GEO_ADDRESS = process.env.API_GEO_ADDRESS;
const API_GEO_ADDRESS_KEY = process.env.API_GEO_ADDRESS_KEY;

//console.log(API_GEO_ADDRESS,API_GEO_ADDRESS_KEY);

//const address = "45 place paul demange";

async function getCoordinates(address, city) {
  try {
    const response = await fetch(
      `${API_GEO_ADDRESS}${address}, ${city}&api_key=${API_GEO_ADDRESS_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Localisation incorrecte');
    }

    const { lat, lon } = data[0];

    if (!lat || !lon) {
      throw new Error('Invalid coordinates data received from API');
    }

    return {
      lat,
      lon,
    };
  } catch (error) {
    console.error('Error fetching coordinates:', error.message);
    throw error; // Relancer l'erreur pour la gérer dans la fonction appelante
  }

  //     const response = await fetch(`${process.env.API_GEO_ADDRESS}${address}${process.env.API_GEO_ADDRESS_KEY}`);
  //   const coordinates = await response.json();

  //   return coordinates;
}

export default getCoordinates;
