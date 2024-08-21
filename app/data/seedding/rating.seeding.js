async function insertRating(client, rating) {
	try {
		const query = {
			text: 'INSERT INTO "rating"("rating") VALUES ($1);',
			values: [rating],
		};
		await client.query(query);

	} catch (error) {
		console.error('Error inserting rating:', error);
	}
}

export {
	insertRating
};


