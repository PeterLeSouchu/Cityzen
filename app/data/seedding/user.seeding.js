async function insertUser(client, email, password, pseudo) {
  const query = {
    text: `INSERT INTO "user"("email", "password", "pseudo") VALUES($1, $2, $3);`,
    values: [email, password, pseudo]
  };
  
  try {
    await client.query(query);
    console.log('User inserted successfully');
  } catch (err) {
    console.error('Error inserting user into DB:', err);
  }
}

async function getOneUser(client) {
  try {
    const result = await client.query(`
    SELECT * FROM "user"
      LIMIT 1;
    ;`);

    const user = result.rows[0];

    return user;
    
  } catch (error) {
    console.log('User not found', error);
  }
}

export {
  insertUser,
  getOneUser,
}