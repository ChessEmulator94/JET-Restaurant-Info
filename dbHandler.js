import mysql from "mysql2";

// Set to localhost
const HOST = "127.0.0.1";
// Set to DB username
const USER = "root";
// Set to DB password
const PASSWORD = "rootroot";
// Set to DB name
const DATABASE = "restaurantsDB";

// Create a lasting connection to the DB
const pool = mysql
  .createPool({
    host: HOST,
    user: USER,
    password: PASSWORD,
    database: DATABASE,
  })
  .promise();
