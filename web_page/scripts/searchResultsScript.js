// Set equal to the URL server is running on (see server.js)
const SERVER_URL = `http://localhost:5500`;

/* When window loads, do thte following:
 *  - Extract searched postcode from the URL
 *  - Check if the postcode is in the database already
 *      - If not in db, add it + associated restaurants to the db
 *  - Get all restaurants from db matching postcode
 *  - Update the display
 */
document.addEventListener("DOMContentLoaded", () => {
  // Get the value of the "postCode" query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const postCode = urlParams.get("postCode");

  // Check that the postcode is in the databse already
  checkPostcodeExists(postCode).then((exists) => {
    if (exists === "false") {
      // if not, query JET API and add resulting listings to db
      console.log("OI VEY");
    }
  });
  // Get the restaurant data
  getRestaurants(postCode).then((response) => {
    console.log(response);
    // Update shown listings
  });
});

// Call dbHandler.js checkPostcodeExists() via the server
const checkPostcodeExists = (postCode) => {
  let queryURL = `${SERVER_URL}/checkExists/${postCode}`;
  return fetch(queryURL, {})
    .then((response) => response.text())
    .then((text) => {
      return text;
    });
};

// Call JET API to update the db
const addRestaurantsToDb = (postCode) => {
  let queryURL = `${SERVER_URL}/add-restaurants/${postCode}`;
  return fetch(queryURL, {})
    .then((response) => response.text())
    .then((text) => {
      return text;
    });
};

// Call dbHandler.js getRestaurants() via the server
const getRestaurants = (postCode) => {
  let queryURL = `${SERVER_URL}/restaurants/${postCode}`;
  return fetch(queryURL, {})
    .then((response) => response.text())
    .then((text) => {
      return text;
    });
};
