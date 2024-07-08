

const userDatamapper = {
  async save(email, hash) {

    const response = await client.query(`
      INSERT INTO "user"("email", "password")
        VALUES ($1, $2)
      ;`, [email, hash])
    ;

    console.log(response);

  }

}

export default userDatamapper;