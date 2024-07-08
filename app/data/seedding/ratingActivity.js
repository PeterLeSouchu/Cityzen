

async function seedRaitingActivityTable(client) {
    try {
        // Récupération des ratings
        const ratingsQuery = await client.query(`SELECT * FROM "raiting"`);
        const ratings = ratingsQuery.rows;

        // Récupération des activités
        const activitiesQuery = await client.query(`SELECT * FROM "activity"`);
        const activities = activitiesQuery.rows;

        // Insertion des données dans la table "raiting_activity"
        for (const activity of activities) {
            for (const rating of ratings) {
                const query = {
                    text: `INSERT INTO "raiting_activity" ("id_activity", "id_raiting") VALUES ($1, $2)`,
                    values: [activity.id, rating.id]
                };

                await client.query(query);
                console.log(`Inserted raiting_activity entry for activity ${activity.id} and rating ${rating.id}`);
            }
        }

        console.log(`Seeding completed.`);
    } catch (error) {
        console.error('Error seeding raiting_activity table:', error);
    }
}

export{
    seedRaitingActivityTable
}
