/**
 *
 * @param {*} url
 * @returns
 */
async function fetchDepartments(url) {
  const departments = await fetch(url)
    .then((response) => response.json())
    .then((data) => data)
    .catch((err) => console.error(err));

  return departments;
}

/**
 *
 * @param {*} client
 * @param {*} departments
 * @returns
 */
async function insertDepartments(client, departments) {
  try {
    const data = await client.query(
      `SELECT * FROM "country" WHERE "name" = 'France';`
    );
    const country = data.rows[0];

    for (const department of departments) {
      const query = {
        text: `INSERT INTO "department"("code", "name") VALUES($1, $2);`,
        values: [department.code, department.nom],
      };

      const result = await client.query(query);

      console.log(`Department inserted: ${department.code}`);
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

export { fetchDepartments, insertDepartments, getDepartmentsFromDB };
