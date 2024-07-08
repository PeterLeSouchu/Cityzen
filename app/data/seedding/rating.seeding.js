

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


import client from "../../config/pg.client.js";


const ratings = [1, 2, 3, 4, 5];

async function insertRatings() {
    for (const rating of ratings) {
        try {
            await insertRating(client, rating);
            console.log(`Inserted rating: ${rating}`);
        } catch (error) {
            console.error('Failed to insert rating:', error);
        }
    }
}

insertRatings();
