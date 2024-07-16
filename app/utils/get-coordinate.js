// TIERCE MODULES
import 'dotenv/config';

const API_GEO_ADDRESS = process.env.API_GEO_ADDRESS;
const API_GEO_ADDRESS_KEY= process.env.API_GEO_ADDRESS_KEY;

//console.log(API_GEO_ADDRESS,API_GEO_ADDRESS_KEY);

//const address = "45 place paul demange";


async function getCoordinates(address){
    
  try {
    const response = await fetch(`${process.env.API_GEO_ADDRESS}${address}&api_key=${process.env.API_GEO_ADDRESS_KEY}`);
      
    if (!response.ok) {
      // throw new Error(`HTTP error! status: ${response.status}`);
      console.log("Fetching coordinates failed", response.status);

      const requestError = new ApiError("Fetching coordinates failed", {
        status: 500,
      });
      requestError.name = 'InternalServerError';
      throw requestError;
    }

    const data = await response.json();
      
    const { lat, lon } = data[0];
    if (lat || lon) {
      // throw new Error('Invalid coordinates data received from API');
      console.log("Coordinates not found", response.status);
      const requestError = new ApiError("Coordinates not found", {
        status: 500,
      });
      requestError.name = 'InternalServerError';
      throw requestError;
    }

    return {
      lat,
      lon
    };

  } catch (error) {
    // console.error('Error fetching coordinates:', error.message);
    // throw error; // Relancer l'erreur pour la gérer dans la fonction appelante

    console.log("Fetching coordinates failed");
    const requestError = new ApiError("Fetching coordinates failed", {
      status: 500,
    });
    requestError.name = 'InternalServerError';
    throw requestError;
  }
}


export default getCoordinates;