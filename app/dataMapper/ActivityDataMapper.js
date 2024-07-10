import client from '../config/pg.client.js'

const dataMapper = {
    async findActivityOfCity(country, city) {
        const query = {
          text: `SELECT *
                 FROM "country"
                 JOIN "city" ON "country".id = "city"."id_country"
                 JOIN "activity" ON "city".id = "activity"."id_city"
                 WHERE "country".name = $1
                 AND "city".name = $2`,
          values: [country, city]
        }
        const result = await client.query(query);
        const {rows} = result;
        return rows;
        
      },

    async findByPk(id){
        const query = {
            text: `SELECT *
                   FROM "activity"
                   WHERE id = $1
                   `,
            values: [id]
          }
          const result = await client.query(query);
          const {rows} = result;
          return rows;
    },

    async findRecent() {
        const query = {
            text: `SELECT *
                   FROM "activity"
                   ORDER BY "created_at" DESC
                   LIMIT 10;`
        };
    
        const result = await client.query(query);
        const { rows } = result;
    
        if (rows.length === 0) {
            console.log(`Aucune activité récente trouvée.`);
        }
    
        return rows;
    },

    async findActivitiesRating() {
        const query = {
            text: `SELECT *
                   FROM "activity"
                   ORDER BY "avg_rating" DESC
                   LIMIT 10;`
        };
    
        const result = await client.query(query);
        const { rows } = result;
    
        if (rows.length === 0) {
            console.log(`Aucune activités  trouvée.`);
        }
    
        return rows;
    },


    async findCity(id_city){
        const query = {
            text: `SELECT *
                   FROM "city"
                   WHERE id = $1
                   `,
            values: [id_city]
          }
          const result = await client.query(query);
          const {rows} = result;
          return rows;
    },


   
    
};

export default dataMapper;
