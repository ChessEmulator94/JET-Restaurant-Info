import bodyParser from "body-parser";
import express, { json } from "express";
//import cors from "cors";

const app = express();
const PORT = 5500;

app.use(bodyParser.json());
app.use(express.json());

// Enables CORS for ALL routes (not safe)
//app.use(cors());

// Import DB handlers
import { getRestaurants } from "./dbHandler.js";

// Import function to get data from api

// Process GET request from http://localhost:${PORT}/
app.get("/restaurants/:postCode", (req, res) => {
  let foundRestaurants = getRestaurants(req.params.postCode);
  res.send(foundRestaurants);
});

// Process POST request from http://localhost:${PORT}/
app.post("/", (req, res) => {});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
