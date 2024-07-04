import { connectDatabase } from './config.js';

const API_DEP_URL = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/georef-france-departement/records?select=dep_name%2C%20dep_code&limit=20';

let departments; 

fetch(API_DEP_URL)
  .then(response => response.json())
  .then(data => {
    const datas = Object.values(data);
    departments = datas[1]; // je reçois des object qui avec des tableau exemple { dep_name : ['paris], dep_code:['75'] }
    
   
    //console.log(departments);
    insertDepartement(); // j'appele la fonction pour insérer les départements une fois les données récupérées
  })
  .catch(error => console.error('Error:', error));

async function insertDepartement() {
  try {
    const client = await connectDatabase();

    for (const department of departments) {
      const name = department.dep_name[0]; // erreur corriger 
      const code = department.dep_code[0];
     
      //console.log(name);
      const countryQuery = 'SELECT * FROM country';
      const data = await client.query(countryQuery);
      const countries = data.rows;
      
      let idcountry = null;
      
      // Trouver l'identifiant du pays France
      countries.forEach(element => {
        if (element.name === 'France') {
          idcountry = element.id;
        }
      });
      
      if (idcountry === null) {
        console.log("error: France not found in country list");
      } else {
        console.log(idcountry);
      
        const query = {
          text: 'INSERT INTO department(name, code, id_country) VALUES($1, $2, $3)',
          values: [name, code, idcountry], 
        };
      
        await client.query(query);
      }
      

      
    }

    await client.end();

  } catch (err) {
    console.error('Error inserting data', err.stack);
  }
}
