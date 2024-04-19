// Set equal to the URL server is running on
const SERVER_URL = `http://localhost:5500`;

// Perform tasks when the window loads
document.addEventListener("DOMContentLoaded", () => {
  // Get the value of the "myVariable" query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const postCode = urlParams.get("postCode");
  console.log(postCode);

  //getRestaurants(postCode);

  // Check that the postcode is in the databse already
  checkPostcodeExists(postCode).then((exists) => {
    if (exists === "false") {
      // if not, query JET API and add results to DB
      console.log("OI VEY");
    }
  });
  // Get data from DB

  // Update shown listings
});

const checkPostcodeExists = (postCode) => {
  let queryURL = `${SERVER_URL}/checkExists/${postCode}`;
  return fetch(queryURL, {})
    .then((response) => response.text())
    .then((text) => {
      //console.log(text);
      return text;
    });
};

const getRestaurants = (postCode) => {
  let queryURL = `${SERVER_URL}/restaurants/${postCode}`;
  return fetch(queryURL, {})
    .then((response) => response.text())
    .then((text) => {
      //console.log(text);
    });
};
