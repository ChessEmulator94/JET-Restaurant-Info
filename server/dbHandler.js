import mysql from "mysql2";
import RestaurantObj from "./restaurantObj.js";

// Set to localhost
const HOST = "127.0.0.1";
// Set to DB username
const USER = "root";
// Set to DB password
const PASSWORD = "rootroot";
// Set to DB name
const DATABASE = "restaurantsDB";

// Create connection to db
const pool = mysql
  .createPool({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
  })
  .promise();

// Get all restaurants that are associated with a postcode
export const getRestaurants = async (postCode) => {
  const result = await pool.query(
    `
    SELECT r.RestaurantName, r.Rating, r.Address, r.LogoURL
    FROM Restaurants r
    INNER JOIN RestaurantPostCodes rpc ON r.id = rpc.RestaurantID
    INNER JOIN PostCodes pc ON rpc.PostCodeID = pc.id
    WHERE pc.PostCode = ?
    `,
    [postCode]
  );
  return result;
};

// Check if postCode is in the database already
export const checkPostcodeExists = async (postCode) => {
  const [rows] = await pool.query(
    "SELECT * FROM PostCodes WHERE PostCode = ?",
    [postCode]
  );
  return rows.length > 0;
};

// Get restaurants for given postcode from JET API
const fetchRestaurants = async (postCode) => {
  const url = `https://uk.api.just-eat.io/discovery/uk/restaurants/enriched/bypostcode/${postCode}`;

  return fetch(url)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      // Return just the restuarant data
      return data.restaurants;
    });
};

// Extract relevant data from API response JSON
const storeRestaurantEssentials = async (allRestaurants, postCode) => {
  // Iterate over all restaurants and save data to DB
  for (let i = 0; i < allRestaurants.length; i++) {
    // Create temporary restaurantObj to hold data
    let tempAddress = `${allRestaurants[i].address.firstLine}, ${allRestaurants[i].address.postalCode}, ${allRestaurants[i].address.city}`;

    let tempRestaurant = new RestaurantObj(
      allRestaurants[i].id,
      allRestaurants[i].name,
      allRestaurants[i].cuisines.map((cuisine) => cuisine.name),
      allRestaurants[i].rating.starRating,
      allRestaurants[i].logoUrl,
      tempAddress
    );

    // Remove duplicate cuisines
    tempRestaurant.cuisines = [...new Set(tempRestaurant.cuisines)];

    // Insert restaurant into db and get it's table insert id
    const restaurantId = await insertRestaurant(tempRestaurant);

    // Insert cuisines and their relationship with the restaurant
    const cuisineIds = await insertCuisines(tempRestaurant.cuisines);
    await insertRestaurantCuisines(restaurantId, cuisineIds);

    // Insert postcodes and their relationship with the restaurant
    const postcodeIds = await insertPostcodes(postCode);
    await insertRestaurantPostcodes(restaurantId, postcodeIds);

    console.log(
      `Restaurant ${tempRestaurant.name} inserted with ID ${restaurantId}`
    );
  }
  console.log("Job done");
};

// Insert row into Restaurants table
const insertRestaurant = async (restaurantObj) => {
  // First, check if the restaurantID already exists
  const checkQuery = `
    SELECT id FROM Restaurants WHERE RestaurantID = ?
  `;
  const [existingResult] = await pool.query(checkQuery, [restaurantObj.id]);

  if (existingResult.length > 0) {
    // If the restaurantID already exists, return its row id
    return existingResult[0].id;
  } else {
    // If the restaurantID doesn't exist, insert the new restaurant and return the new row id
    const restaurantQuery = `
      INSERT INTO Restaurants (RestaurantName, Rating, Address, LogoURL, RestaurantID)
      VALUES (?, ?, ?, ?, ?)
    `;
    const restaurantValues = [
      restaurantObj.name,
      restaurantObj.rating,
      restaurantObj.address,
      restaurantObj.logoUrl,
      restaurantObj.id,
    ];

    const [result] = await pool.query(restaurantQuery, restaurantValues);
    const restaurantId = result.insertId;
    return restaurantId;
  }
};

// Insert row into Cuisines table
const insertCuisines = async (cuisines) => {
  const cuisineIds = [];

  for (const cuisine of cuisines) {
    // First, check if the cuisine already exists
    const checkQuery = `
      SELECT id FROM Cuisines WHERE Cuisine = ?
    `;
    const [existingResult] = await pool.query(checkQuery, [cuisine]);

    // If the cuisine already exists, add its id to the cuisineIds array
    if (existingResult.length > 0) {
      cuisineIds.push(existingResult[0].id);
    } else {
      // If the cuisine doesn't exist, insert it and add the new id to the cuisineIds array
      const insertQuery = `
        INSERT INTO Cuisines (Cuisine) VALUES (?)
      `;
      const [result] = await pool.query(insertQuery, [cuisine]);
      cuisineIds.push(result.insertId);
    }
  }

  return cuisineIds;
};

// Insert row into RestaurantCuisines table
const insertRestaurantCuisines = async (restaurantId, cuisineIds) => {
  const values = [];

  for (const cuisineId of cuisineIds) {
    // First, check if the combination of restaurantId and cuisineId already exists
    const checkQuery = `
      SELECT * FROM RestaurantCuisines WHERE RestaurantID = ? AND CuisineID = ?
    `;
    const [existingResult] = await pool.query(checkQuery, [
      restaurantId,
      cuisineId,
    ]);

    // If the combination doesn't exist, add it to the values array
    if (existingResult.length === 0) {
      values.push([restaurantId, cuisineId]);
    }
  }

  // If there are new combinations to insert, execute the INSERT query
  if (values.length > 0) {
    const relationQuery = `
      INSERT INTO RestaurantCuisines (RestaurantID, CuisineID) VALUES ?
    `;
    await pool.query(relationQuery, [values]);
  }
};

// Insert row into Postcodes table
const insertPostcodes = async (postcode) => {
  // First, check if the postcode already exists
  const checkQuery = `
    SELECT id FROM PostCodes WHERE PostCode = ?
  `;
  const [existingResult] = await pool.query(checkQuery, [postcode]);

  if (existingResult.length > 0) {
    // If the postcode already exists, return its id
    return [existingResult[0].id];
  } else {
    // If the postcode doesn't exist, insert it and return the new id
    const insertQuery = `
      INSERT INTO PostCodes (PostCode) VALUES (?)
    `;
    const [result] = await pool.query(insertQuery, [postcode]);
    return [result.insertId];
  }
};

// Insert row into ResaurantPostcodes table
const insertRestaurantPostcodes = async (restaurantId, postcodeIds) => {
  const values = [];

  for (const postcodeId of postcodeIds) {
    // First, check if the combination of restaurantId and postcodeId already exists
    const checkQuery = `
      SELECT * FROM RestaurantPostCodes WHERE RestaurantID = ? AND PostCodeID = ?
    `;
    const [existingResult] = await pool.query(checkQuery, [
      restaurantId,
      postcodeId,
    ]);

    if (existingResult.length === 0) {
      // If the combination doesn't exist, add it to the values array
      values.push([restaurantId, postcodeId]);
    }
  }

  if (values.length > 0) {
    // If there are new combinations to insert, execute the INSERT query
    const relationQuery = `
      INSERT INTO RestaurantPostCodes (RestaurantID, PostCodeID) VALUES ?
    `;
    await pool.query(relationQuery, [values]);
  }
};

export const addListings = async (postCode) => {
  fetchRestaurants(postCode).then((result) => {
    storeRestaurantEssentials(result, postCode);
  });
};

getRestaurants("EC4M7RF").then((result) => {
  console.log(result);
});
