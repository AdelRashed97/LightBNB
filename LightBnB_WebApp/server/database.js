const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  const query =
  `SELECT *
  FROM users
  WHERE email = $1;`;

  return pool.query(query,[email])
    .then(res => {
      if (res.rows.length === 0) {
        return null;
      } else {
        return res.rows[0];
      }

    })
    .catch(err => console.log(err.stack));
  
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const query =
  `SELECT *
  FROM users
  WHERE id = $1;`;

  return pool.query(query,[id])
    .then(res => {
      if (res.rows[0].length === 0) {
        return null;
      } else {
        return res.rows[0];
      }

    })
    .catch(err => console.log(err.stack));
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const query = `
    INSERT INTO users (name,email,password) 
    VALUES ($1,$2,$3) RETURNING *;`;
  return pool.query(query,[user.name,user.email,user.password])
    .then(res => res.rows[0]);

//   const userId = Object.keys(users).length + 1;
//   user.id = userId;
//   users[userId] = user;
//   return Promise.resolve(user);
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const query =`SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`
  return pool.query(query,[guest_id,limit])
    .then(res => res.rows)
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_id`;

  if (options.owner_id) {
    queryParams.push(options.owner_id)
    queryString += ` WHERE properties.owner_id = $${queryParams.length}`
  }
  
  // Add city filter
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `
    WHERE properties.city LIKE $${queryParams.length}`;
  };

  // Add min price filter
  if (options.minimum_price_per_night) {
    if (queryParams.length > 0) {
      queryString += `
      AND `
     } else {
      queryString += `
      WHERE `;
    }

    queryParams.push(options.minimum_price_per_night);
    queryString += ` properties.cost_per_night >= $${queryParams.length}`;
  };

  // Add max price filter
  if (options.maximum_price_per_night) {
     if (queryParams.length > 0) {
      queryString += `
      AND `
     } else {
      queryString += `
      WHERE `;
    }
    queryParams.push(options.maximum_price_per_night);
    queryString += ` properties.cost_per_night <= $${queryParams.length}`;
  };

  // Add group by
  queryString += `
  GROUP BY properties.id`;

  // Add minimum rating filter
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `
    HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
  };

  // Add limit and order by
  queryParams.push(limit);
  queryString += `
  ORDER BY properties.cost_per_night
  LIMIT $${queryParams.length};
  `;

  console.log(queryString);
  return pool.query(queryString, queryParams)
  .then(res => {
    console.log(res.rows)
    return res.rows});
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryParams = [
    property.title,
    property.description,
    property.owner_id,
    property.cover_photo_url,
    property.thumbnail_photo_url,
    property.cost_per_night,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms,
    property.province,
    property.city,
    property.country,
    property.street,
    property.post_code,
    true
  ];
  
  const queryString = `
  INSERT INTO properties (title, description, owner_id, cover_photo_url, thumbnail_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, province, city, country, street, post_code, active)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
  RETURNING *;
  `;

  return pool.query(queryString, queryParams)
  .then(res => res.rows[0])
  .catch(err => console.log(err));
}
exports.addProperty = addProperty;
