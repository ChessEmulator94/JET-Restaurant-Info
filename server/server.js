import bodyParser from "body-parser";
import express, { json, response } from "express";
import {
  getRestaurants,
  checkPostcodeExists,
  addListings,
} from "./dbHandler.js";
import cors from "cors";

const app = express();
const PORT = 5500;

app.use(bodyParser.json());
app.use(express.json());

//Enables CORS for ALL routes
app.use(cors());

// Import function to get data from api

// Call getRestaurants on dbHandler
app.get("/restaurants/:postCode", (req, res) => {
  let postCode = req.params.postCode;
  getRestaurants(postCode).then((response) => {
    res.send(response);
  });
});

// Call checkPostcodeExists on dbHandler
app.get("/checkExists/:postCode", (req, res) => {
  let postCode = req.params.postCode;
  checkPostcodeExists(postCode).then((response) => {
    res.send(response);
  });
});

app.get("/add-restaurants/:postCode", (req, res) => {
  let postCode = req.params.postCode;
  addListings(postCode).then((response) => {
    res.send(response);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
