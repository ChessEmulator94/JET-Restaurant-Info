/* IMPORTS */
import bodyParser from "body-parser";
import express, { json, response } from "express";
import {
  getRestaurants,
  getRestaurantsWithFilter,
  checkPostcodeExists,
  addListings,
  getRestaurantInfo,
} from "./dbHandler.js";
import cors from "cors";

const app = express();
const PORT = 5500;

app.use(bodyParser.json());
app.use(express.json());

// Enables CORS for ALL routes
app.use(cors());

/* ROUTES */

// Call getRestaurants() on dbHandler.js
// Returns all restauranst associated with a postcode
app.get("/restaurants/:postCode", (req, res) => {
  let postCode = req.params.postCode;
  getRestaurants(postCode).then((response) => {
    res.send(response);
  });
});

// Call getRestaurantsWithFilter() on dbHandler.js
// Returns restaurants associated with a postcode and cuisine
app.get("/restaurants/:postCode/:cuisine", (req, res) => {
  const postCode = req.params.postCode;
  const cuisine = req.params.cuisine;
  //res.send("HELLO");
  getRestaurantsWithFilter(postCode, cuisine).then((response) => {
    res.send(response);
  });
});

// Call checkPostcodeExists() on dbHandler.js
// Returns true or false
app.get("/checkExists/:postCode", (req, res) => {
  let postCode = req.params.postCode;
  checkPostcodeExists(postCode).then((response) => {
    res.send(response);
  });
});

// Call addListings() on dbHandler.js
// Adds all restaurants associated with a postcode
app.get("/add-restaurants/:postCode", (req, res) => {
  let postCode = req.params.postCode;
  addListings(postCode).then((response) => {
    res.send(response);
  });
});

// Call getRestaurantInfo() on dbHandler.js
// Get all restaurant info given a restaurant-table id
app.get("/restaurant/:id", (req, res) => {
  let id = req.params.id;
  getRestaurantInfo(id).then((response) => {
    res.send(response);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
