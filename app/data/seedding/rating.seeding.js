

// ratings.js - Function to insert ratings into the database
async function insertRating(client, rating) {
    try {
        const query = {
            text: 'INSERT INTO "raiting" ("raiting") VALUES ($1)',
            values: [rating],
        };
        await client.query(query);
    
    } catch (error) {
        console.error('Error inserting rating:', error);
        throw error;
    }
}


export {
    insertRating
};


