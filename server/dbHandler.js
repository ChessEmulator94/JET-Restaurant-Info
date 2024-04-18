import mysql from "mysql2";
import RestaurantObj from "./server/restaurantObj.js";

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
const getRestaurants = async (postCode) => {
  const result = await pool.query(
    `
    SELECT r.RestaurantName, r.Rating, r.Address, r.LogoURL
    FROM Restaurants r
    INNER JOIN RestaurantPostCodes rpc ON r.RestaurantID = rpc.RestaurantID
    INNER JOIN PostCodes pc ON rpc.PostCodeID = pc.id
    WHERE pc.PostCode = ?
    `,
    [postCode]
  );
  return result;
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

// Store restuarant data to database
const saveRestaurant = (restaurantObj) => {};

// Extract relevant data from API response JSON
const storeRestaurantEssentials = async (allRestaurants) => {
  // Iterate over all restaurants and save data to DB
  for (let i = 0; i < allRestaurants.length; i++) {
    // Create temporary restaurantObj to hold data
    let tempRestaurant = new RestaurantObj(
      allRestaurants[i].id,
      allRestaurants[i].name,
      allRestaurants[i].cuisines,
      allRestaurants[i].rating.starRating,
      allRestaurants[i].logoUrl,
      allRestaurants[i].address
    );

    // Store the restaurant data to the db
  }
};

// Test function
getRestaurants("24680").then((result) => {
  //console.log(result);
});

// Test fetchRestaurants
fetchRestaurants("EC4M7RF").then((result) => {
  //console.log(result);
  storeRestaurantEssentials(result);
});

module.exports = {
  getRestaurants,
};
