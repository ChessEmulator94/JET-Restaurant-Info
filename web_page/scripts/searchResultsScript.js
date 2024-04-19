// Set equal to the URL server is running on (see server.js)
const SERVER_URL = `http://localhost:5500`;

// Offset the restaurants being shown
let listingOffset = 0;

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
      addRestaurantsToDb(postCode).then(
        // Get the restaurant data
        getRestaurants(postCode).then((response) => {
          // Update shown listings
          updateView(response);
        })
      );
    } else {
      // Get the restaurant data
      getRestaurants(postCode).then((response) => {
        // Update shown listings
        updateView(response);
      });
    }
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

const updateView = (allRestaurants) => {
  let allRestaurantsJSON = JSON.parse(allRestaurants);
  console.log(allRestaurants);
  console.log(allRestaurantsJSON[0][0].RestaurantName); // Access the first object in the nested array
  console.log("here");

  for (let i = 1; i < 10; i++) {
    // Calculate which listing data to use
    let listingToUse = i + listingOffset - 1;

    // Select the .single-listing element by it's unique ID
    const listingElement = document.getElementById(`listing${i}`);

    // Get logo element
    const imgElement = listingElement.querySelector(".restaurant-image img");
    // Get name element
    const nameSpan = listingElement.querySelector(".restaurant-name span");
    // Get rating element
    const ratingSpan = listingElement.querySelector(".restaurant-rating span");
    // Get cuisines element
    const cuisinesSpan = listingElement.querySelector(
      ".restaurant-cuisines span"
    );
    // Get address element
    const addressSpan = listingElement.querySelector(
      ".restaurant-address span"
    );

    // Get the first cuisine from the array
    const cuisineArray =
      allRestaurantsJSON[0][listingToUse].Cuisines.split(" | ");

    // Use the first valid cuisine image as the background
    getFirstValidCuisineImage(cuisineArray).then((imageUrl) => {
      listingElement.style.backgroundImage = `url('${imageUrl}')`;
    });

    // Update logo
    imgElement.src = allRestaurantsJSON[0][listingToUse].LogoURL;
    // Update name
    nameSpan.textContent = allRestaurantsJSON[0][listingToUse].RestaurantName;
    // Update rating
    ratingSpan.textContent = allRestaurantsJSON[0][listingToUse].Rating;
    // Updatecuisines
    cuisinesSpan.textContent = allRestaurantsJSON[0][listingToUse].Cuisines;
    // Update address
    addressSpan.textContent = allRestaurantsJSON[0][listingToUse].Address;
  }
};

// Function to check if the image URL returns a 404
const isImageOk = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

// Function to find the first valid cuisine image
const getFirstValidCuisineImage = (cuisineArray) => {
  const findValidImage = async () => {
    for (const cuisine of cuisineArray) {
      const imageUrl = `https://just-eat-prod-eu-res.cloudinary.com/image/upload/c_fill,f_auto,q_auto,w_425,d_uk:cuisines:${cuisine.trim()}-1.jpg/v1/uk/restaurants`;
      const isValid = await isImageOk(imageUrl);
      if (isValid) {
        return imageUrl;
      }
    }
    // If no valid cuisine image is found, return a default image URL
    return "https://example.com/default-image.jpg";
  };

  return findValidImage();
};
