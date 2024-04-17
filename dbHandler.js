import mysql from "mysql2";

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

// Test function
getRestaurants("24680").then((result) => {
  console.log(result);
});
