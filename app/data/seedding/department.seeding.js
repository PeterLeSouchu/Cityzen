
/**
 * 
 * @param {*} url 
 * @returns 
 */
function fetchDepartments(url) {
  const departments = fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data)
  
      /* Exemple from data :
        [
          { nom: 'Ain', code: '01', codeRegion: '84' },
          { nom: 'Aisne', code: '02', codeRegion: '32' },
          { nom: 'Allier', code: '03', codeRegion: '84' },
        ]
      */ 
      
      return data;
    })
    .catch(err => console.error(err));

  return departments;
};

/**
 * 
 * @param {*} client 
 * @param {*} departments 
 * @returns 
 */
async function insertDepartments(client, departments) {
  try {
    const data = await client.query(`SELECT * FROM "country" WHERE "name" = 'france'`);
    const country = data.rows;
    
    let countryId = country.id;

    for (const department of departments) {
      const name = department.name; 
      const code = department.code;
     
      
      const query = {
        text: `BEGIN;
        INSERT INTO department( code, name, id_country) VALUES($1, $2, $3);
        COMMIT;`,
        values: [name, code, countryId], 
      };

      const result = await client.query(query);

      return result;
      // if (idcountry === null) {
      //   console.log("error: France not found in country list");
      // } else {
      //   console.log(idcountry);
      //   await client.query(query);
      // }
    }

  } catch (err) {
    console.error('Error database', err);
  }
}

/**
 * 
 * @param {*} client 
 * @returns 
 */
async function getDepartmentsFromDB(client) {
  try {
    const query = 'SELECT * FROM "department"';
    const data = await client.query(query);
    return data.rows;
  } catch (err) {
    console.error('Error getting department code from DB:', err);
  }
}


export {
  fetchDepartments,
  insertDepartments,
  getDepartmentsFromDB,
}