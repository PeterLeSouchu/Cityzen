class CoreDatamapper {
  tablenName = null;

  // index
  async getAll(endpointsArray) {
    // We have to override the getAll method because they diverge too much depending on the routes
    // /recent
    // /rating
    // /:country/:city


    const result = await client.query(`SELECT * FROM ${this.tablenName};`);

    return result.rows; 
  }


  async getOne(id) {
    const result = await client.query(`
    SELECT * FROM ${this.tablenName}
      WHERE "id" = $1
    ;
    `, [id]);

    return result.rows;
  }

  async create(data) {


    return result.rows;
  }

  async update(id, data) {


    return result.rows;
  }

  async delete(id) {
    const result = await client.query(`
    DELETE FROM ${this.tablenName}
      WHERE "id" = $1
    ;
    `, [id]);

    return result.rows;
  }
}