async function fetchActivitiesFromCity(cityName) {
  const API_ACTIVITY_URL = `https://api.yelp.com/v3/businesses/search?location=${cityName}&limit=10`;
  const activities = await fetch(API_ACTIVITY_URL, {
    headers: {
      Authorization:
        'Bearer Rd5PQvdtAG_mnsYICR0QGlvZaATQFSvXMNOkcTxGy0dfeyk7kvmVrx-07yFNF4zYaxR-spgAN12kwl51BRVntfWxQ-q1XioPdhBdzto-lS_VoKYNabEuUZGeb690ZnYx',
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => data.businesses)
    .catch((err) => console.log(err));

  return activities;
}

// La fonction pour formater l'activité
async function formatingActivity(activityFromFetch, cityId, userId) {
  const formatedActivity = {
    slug: activityFromFetch.alias,
    // url: activityFromFetch.url,
    title: activityFromFetch.name,
    description: activityFromFetch.name,
    url_image: activityFromFetch.image_url,
    address: activityFromFetch.location.address1,
    phone: activityFromFetch.phone,
    avg_rating: activityFromFetch.rating,
    latitude: activityFromFetch.coordinates.latitude,
    longitude: activityFromFetch.coordinates.longitude,
    id_user: userId,
    id_city: cityId,
  };

  // Afficher l'activité formatée pour vérification
  console.log('Activité formatée:', formatedActivity);

  return formatedActivity;
}

async function insertActivityFromCity(client, activity) {
  const {
    slug,
    title,
    description,
    url_image,
    address,
    phone,
    avg_rating,
    latitude,
    longitude,
    id_user,
    id_city,
  } = activity;
  try {
    const query = {
      text: `INSERT INTO "activity"("slug", "title", "description", "url_image", "address", "phone", "avg_rating", "latitude", "longitude", "id_user", "id_city") 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
      values: [
        slug,
        title,
        description,
        url_image,
        address,
        phone,
        avg_rating,
        latitude,
        longitude,
        id_user,
        id_city,
      ],
    };

    const returningQuery = await client.query(query);
    const insertedActivities = returningQuery.rows[0];
    console.log('insertedActivities effectué');
  } catch (err) {
    console.error("Erreur lors de l'insertion de l'activité :", err);
  }
}

async function getCityActivitiesFromDB(client, cityName) {
  try {
    const query = `SELECT * FROM "activity" 
      JOIN "city" ON "activity"."id_city" = "city"."id"
        WHERE "city"."name" = $1
      ;`;
    const data = await client.query(query, [cityName]);
    console.table(data);
    return data.rows;
  } catch (err) {
    console.error('Error getting cities from DB:', err);
  }
}

const activityFromFetch = {
  id: 'KggnM_Z4wOa_JExunaaWHg',
  alias: 'le-temps-des-cerises-paris-5',
  name: 'Le Temps des Cerises',
  image_url:
    'https://s3-media4.fl.yelpcdn.com/bphoto/UqeDuXHQOBoBoKWguRUsFg/o.jpg',
  is_closed: false,
  url: 'https://www.yelp.com/biz/le-temps-des-cerises-paris-5?adjust_creative=dZzivn8vfgDHuwY0IfOBjg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dZzivn8vfgDHuwY0IfOBjg',
  review_count: 377,
  categories: [[Object], [Object], [Object]],
  rating: 4.4,
  coordinates: { latitude: 48.852569, longitude: 2.364184 },
  transactions: [],
  price: '€€€',
  location: {
    address1: '31 rue de la Cerisaie',
    address2: null,
    address3: null,
    city: 'Paris',
    zip_code: '75004',
    country: 'FR',
    state: '75',
    display_address: [Array],
  },
  phone: '+33142720863',
  display_phone: '+33 1 42 72 08 63',
  distance: 1920.7073073260806,
  attributes: {
    business_temp_closed: null,
    menu_url: 'http://letempsdescerises-restaurant.fr/menu/',
    open24_hours: null,
    waitlist_reservation: null,
  },
};

//fetchActivitiesFromCity('Paris');

export {
  fetchActivitiesFromCity,
  formatingActivity,
  insertActivityFromCity,
  activityFromFetch,
};
