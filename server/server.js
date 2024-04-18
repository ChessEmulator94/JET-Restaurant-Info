import bodyParser from "body-parser";
import express, { json } from "express";
// Import DB handlers
import { getRestaurants } from "./dbHandler.js";
import cors from "cors";

const app = express();
const PORT = 5500;

app.use(bodyParser.json());
app.use(express.json());

//Enables CORS for ALL routes
app.use(cors());

// Import function to get data from api

// Process GET request from http://localhost:${PORT}/
app.get("/restaurants/:postCode", (req, res) => {
  let postCode = req.params.postCode;
  getRestaurants(postCode).then((response) => {
    res.send(response[0]);
  });
});

// Process POST request from http://localhost:${PORT}/
app.post("/", (req, res) => {});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port: http://localhost:${PORT}`);
});
