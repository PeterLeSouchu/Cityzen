


async function fetchActivitiesFromCity(cityName) {
  const API_ACTIVITY_URL = `https://api.yelp.com/v3/businesses/search?location=${cityName}&limit=10`;
  const activitiesOfcity = await fetch(API_ACTIVITY_URL, {
    headers: {
        'Authorization': 'Bearer Rd5PQvdtAG_mnsYICR0QGlvZaATQFSvXMNOkcTxGy0dfeyk7kvmVrx-07yFNF4zYaxR-spgAN12kwl51BRVntfWxQ-q1XioPdhBdzto-lS_VoKYNabEuUZGeb690ZnYx',
        'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => data.businesses)
  .catch(err => console.log(err));


   console.log(activitiesOfcity)
  return activitiesOfcity;
}

/*
 {
    id: 'KggnM_Z4wOa_JExunaaWHg',
    alias: 'le-temps-des-cerises-paris-5',
    name: 'Le Temps des Cerises',
    image_url: 'https://s3-media4.fl.yelpcdn.com/bphoto/UqeDuXHQOBoBoKWguRUsFg/o.jpg',
    is_closed: false,
    url: 'https://www.yelp.com/biz/le-temps-des-cerises-paris-5?adjust_creative=dZzivn8vfgDHuwY0IfOBjg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dZzivn8vfgDHuwY0IfOBjg',
    review_count: 377,
    categories: [ [Object], [Object], [Object] ],
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
      display_address: [Array]
    },
    phone: '+33142720863',
    display_phone: '+33 1 42 72 08 63',
    distance: 1920.7073073260806,
    attributes: {
      business_temp_closed: null,
      menu_url: 'http://letempsdescerises-restaurant.fr/menu/',
      open24_hours: null,
      waitlist_reservation: null
    }
  },

*/

// 1- insérer un utilisateur fictif en BDD (ne lancer le script qu'un seul fois !)
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



async function formatingActivity(activityFromFetch) {

  // 
  const userData = await client.query(`SELECT * FROM "user" WHERE id = $1`, [user]);
  const utilisateurData = userData.rows[0];

  if (!utilisateurData) {
    throw new Error('User non trouvé');
  }

  const cities = await client.query(`SELECT * FROM "city"`);
  const cityData = cities.rows[0];

  if (!cityData) {
    throw new Error('city non trouvé');
  }



  const formatedActivity = {
    slug: activityFromFetch.alias,
    url: activityFromFetch.url,
    title: activityFromFetch.name,
    description: activityFromFetch.name,
    url_image: activityFromFetch.image_url,
    address: activityFromFetch.location.address1,
    phone: activityFromFetch.phone,
    avg_raiting: activityFromFetch.raiting,
    latitude: activityFromFetch.coordinates.latitude,
    longitude: activityFromFetch.coordinates.longitude,
    id_user: utilisateurData.id,
    id_city: city,
  }
  return formatedActivity;
}


async function insertActivitiesFromCity(client, activity) {
  const {slug, url, title, description, url_image, address, phone, avg_raiting, latitude, longitude, userId, cityId } = activity;
  try {

    const query = {
      text: `INSERT INTO "activity"("slug", "url", "title", "description", "url_image", "address", "phone", "avg_raiting", "latitude", "longitude", "id_user", "id_city") 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`,
      values: [slug, url, title, description, url_image, address, phone, avg_raiting, latitude, longitude, userId, cityId], 
    };
  
    await client.query(query);

  } catch (err) {
    console.error('Error inserting activity:',err);
  }
}



/*

const activity = data.businesses.map(business => ({
    slug: business.alias,
    url: business.url,  // c'est le front qui construit l'url à partir du slug. Ne pas prendre en compte la valeur.
    description: business.name,  // 'Pas de description pour cette actvité'
    urlImage: business.image_url,
    address: business.location.address1,
    phone: business.phone,
    latitude: business.coordinates.latitude,
    longitude: business.coordinates.longitude,
}));

*/


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


//fetchActivitiesFromCity('Paris');

export {
    fetchActivitiesFromCity,
    insertUser,
    formatingActivity,
    insertActivitiesFromCity

}
  



/* Exemple de fetch activities pour Paris 


 {
    id: 'KggnM_Z4wOa_JExunaaWHg',
    alias: 'le-temps-des-cerises-paris-5',
    name: 'Le Temps des Cerises',
    image_url: 'https://s3-media4.fl.yelpcdn.com/bphoto/UqeDuXHQOBoBoKWguRUsFg/o.jpg',
    is_closed: false,
    url: 'https://www.yelp.com/biz/le-temps-des-cerises-paris-5?adjust_creative=dZzivn8vfgDHuwY0IfOBjg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dZzivn8vfgDHuwY0IfOBjg',
    review_count: 377,
    categories: [ [Object], [Object], [Object] ],
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
      display_address: [Array]
    },
    phone: '+33142720863',
    display_phone: '+33 1 42 72 08 63',
    distance: 1920.7073073260806,
    attributes: {
      business_temp_closed: null,
      menu_url: 'http://letempsdescerises-restaurant.fr/menu/',
      open24_hours: null,
      waitlist_reservation: null
    }
  },
  {
    id: '2qzLbDM1dkpsKyyCXAEXWw',
    alias: 'guy-savoy-paris-3',
    name: 'Guy Savoy',
    image_url: 'https://s3-media3.fl.yelpcdn.com/bphoto/WFc_65erqcdcypw5I-_oMA/o.jpg',
    is_closed: false,
    url: 'https://www.yelp.com/biz/guy-savoy-paris-3?adjust_creative=dZzivn8vfgDHuwY0IfOBjg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dZzivn8vfgDHuwY0IfOBjg',
    review_count: 93,
    categories: [ [Object] ],
    rating: 4.6,
    coordinates: { latitude: 48.857, longitude: 2.3386999 },
    transactions: [],
    price: '€€€€',
    location: {
      address1: 'Monnaie de Paris',
      address2: '11 quai de Conti',
      address3: '',
      city: 'Paris',
      zip_code: '75006',
      country: 'FR',
      state: '75',
      display_address: [Array]
    },
    phone: '+33143804061',
    display_phone: '+33 1 43 80 40 61',
    distance: 590.7696513609623,
    attributes: {
      business_temp_closed: null,
      menu_url: 'http://www.guysavoy.com/#page_menu',
      open24_hours: null,
      waitlist_reservation: null
    }
  },
  {
    id: 'ZpVf9wbJMKAogWgJhcMqZg',
    alias: 'pink-mamma-paris',
    name: 'Pink Mamma',
    image_url: 'https://s3-media1.fl.yelpcdn.com/bphoto/okfnivvKXKSDrtY4qUqoWg/o.jpg',
    is_closed: false,
    url: 'https://www.yelp.com/biz/pink-mamma-paris?adjust_creative=dZzivn8vfgDHuwY0IfOBjg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dZzivn8vfgDHuwY0IfOBjg',
    review_count: 457,
    categories: [ [Object], [Object], [Object] ],
    rating: 4,
    coordinates: { latitude: 48.88187, longitude: 2.3346 },
    transactions: [],
    price: '€€€',
    location: {
      address1: '20 bis rue de Douai',
      address2: '',
      address3: null,
      city: 'Paris',
      zip_code: '75009',
      country: 'FR',
      state: '75',
      display_address: [Array]
    },
    phone: '+33983559452',
    display_phone: '+33 9 83 55 94 52',
    distance: 2288.80902462338,
    attributes: {
      business_temp_closed: null,
      menu_url: 'https://www.bigmammagroup.com/admin/wp-content/uploads/2017/06/Menu-Pink-Mamma-Web-.pdf',
      open24_hours: null,
      waitlist_reservation: null
    }
  },
  {
    id: 'FFz-WusZrBYZexKqhqzCkg',
    alias: 'l-as-du-fallafel-paris',
    name: "L'As du Fallafel",
    image_url: 'https://s3-media1.fl.yelpcdn.com/bphoto/rxDnJCfkAtIpRo_4QNmt9Q/o.jpg',
    is_closed: false,
    url: 'https://www.yelp.com/biz/l-as-du-fallafel-paris?adjust_creative=dZzivn8vfgDHuwY0IfOBjg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dZzivn8vfgDHuwY0IfOBjg',
    review_count: 1975,
    categories: [ [Object], [Object], [Object] ],
    rating: 4.3,
    coordinates: { latitude: 48.857498, longitude: 2.35908 },
    transactions: [],
    price: '€€',
    location: {
      address1: '34 rue des Rosiers',
      address2: '',
      address3: '',
      city: 'Paris',
      zip_code: '75004',
      country: 'FR',
      state: '75',
      display_address: [Array]
    },
    phone: '+33148876360',
    display_phone: '+33 1 48 87 63 60',
    distance: 1334.296841418717,
    attributes: {
      business_temp_closed: null,
      menu_url: null,
      open24_hours: null,
      waitlist_reservation: null
    }
  },
  {
    id: 'ZxtU74SJMRoB8ZQXWwNtRQ',
    alias: 'le-soufflé-paris-2',
    name: 'Le Soufflé',
    image_url: 'https://s3-media2.fl.yelpcdn.com/bphoto/dJSOGUbTZi9FqZgOm509KQ/o.jpg',
    is_closed: false,
    url: 'https://www.yelp.com/biz/le-souffl%C3%A9-paris-2?adjust_creative=dZzivn8vfgDHuwY0IfOBjg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dZzivn8vfgDHuwY0IfOBjg',
    review_count: 338,
    categories: [ [Object] ],
    rating: 4.2,
    coordinates: { latitude: 48.86645, longitude: 2.32647 },
    transactions: [],
    price: '€€€',
    location: {
      address1: '36 rue du Mont Thabor',
      address2: null,
      address3: null,
      city: 'Paris',
      zip_code: '75001',
      country: 'FR',
      state: '75',
      display_address: [Array]
    },
    phone: '+33142602719',
    display_phone: '+33 1 42 60 27 19',
    distance: 1246.708293379906,
    attributes: {
      business_temp_closed: null,
      menu_url: 'http://www.lesouffle.fr/menu-carte',
      open24_hours: null,
      waitlist_reservation: null
    }
  },
  {
    id: '4UO8M5flLUR5-TxGdSma0Q',
    alias: 'les-papilles-paris-2',
    name: 'Les Papilles',
    image_url: 'https://s3-media4.fl.yelpcdn.com/bphoto/fY9WjrMdU6Fn9DmX3uFUcg/o.jpg',
    is_closed: false,
    url: 'https://www.yelp.com/biz/les-papilles-paris-2?adjust_creative=dZzivn8vfgDHuwY0IfOBjg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=dZzivn8vfgDHuwY0IfOBjg',
    review_count: 260,
    categories: [ [Object], [Object] ],
    rating: 4.5,
    coordinates: { latitude: 48.84461, longitude: 2.34174 },
    transactions: [],
    price: '€€€',
    location: {
      address1: '30 rue Gay-Lussac',
      address2: null,
      address3: null,
      city: 'Paris',
      zip_code: '75005',
      country: 'FR',
      state: '75',
      display_address: [Array]
    },
    phone: '+33143252079',
    display_phone: '+33 1 43 25 20 79',
    distance: 1936.8267615430166,
    attributes: {
      business_temp_closed: null,
      menu_url: null,
      open24_hours: null,
      waitlist_reservation: null
    }
  }
]




*/