import { connectDatabase } from './config.js';

async function fetchDepartmentcode() {
  let client;
  try {
    client = await connectDatabase();
    const departmentQuery = 'SELECT * FROM "department"';
    const data = await client.query(departmentQuery);
    return data.rows;
  } catch (error) {
    console.error('Error fetching department code:', error);
    return [];
  } finally {
    if (client) {
      client.release(); // fin de connection
    }
  }
}

async function fetchCitiesFromDepartement(departementCode) {
  const API_CITY_URL = `https://geo.api.gouv.fr/departements/${departementCode}/communes`;
  console.log(API_CITY_URL);
  try {
    const response = await fetch(API_CITY_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

async function injectCitiesToDB(departementsArray) {
  let client;
  try {
    client = await connectDatabase();
    

    // Je récupère les pays (id) pour les clés étrangères
    const countryQuery = 'SELECT * FROM country';
    const data = await client.query(countryQuery);
    const countries = data.rows;
    let idCountry = null;

    // Trouver l'identifiant du pays France
    countries.forEach(element => {
      if (element.name === 'France') {
        idCountry = element.id;
      }
    });

    if (idCountry === null) {
      console.error("Error: France not found in country list");
      return;
    }

    console.log("ID du pays France :", idCountry);

    for (const departement of departementsArray) {
      const idDepartment = departement.id;
      console.log(departement.name);
      const citiesOfDepartement = await fetchCitiesFromDepartement(departement.code);
      for (const city of citiesOfDepartement) {
        const nameCity = city.nom;
        const zip_code = city.codesPostaux.join(',');
        console.log(nameCity, zip_code, idDepartment);

        await client.query('BEGIN');
        const query = {
          text: 'INSERT INTO "city"(name, zip_code, id_department, id_country) VALUES($1, $2, $3, $4)',
          values: [nameCity, zip_code, idDepartment, idCountry], 
        };
      
        await client.query(query);

        await client.query('COMMIT');
        console.log(`Inserted city: ${nameCity}`);
        
      }
    }

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting data:', error.stack);
  } finally {
    if (client) {
      client.release(); 
    }
  }
}

// Main function to execute the process
(async () => {
  const departementsArray = await fetchDepartmentcode();
  if (departementsArray.length > 0) {
    await injectCitiesToDB(departementsArray);
  } else {
    console.error('No departments found.');
  }
})();
