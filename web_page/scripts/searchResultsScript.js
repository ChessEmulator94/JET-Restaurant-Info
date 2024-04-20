// Set equal to the URL server is running on (see server.js)
const SERVER_URL = `http://localhost:5500`;

// Offset the restaurants being shown
let listingOffset = 0;

// Stores all restaurants from a search
let allRestaurantsLong;

// Store postCode of current search
let globalPostCode;

// Get elements from the DOM
const displayedArea = document.querySelector(".location-name span");
const leftArrow = document.querySelector("#nav-btn-1");
const rightArrow = document.querySelector("#nav-btn-2");

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

  globalPostCode = postCode;

  updateAreaPin(postCode);

  checkPostcodeExists(postCode).then((exists) => {
    if (exists === "false") {
      console.log("Data doesn't exist yet");
      addRestaurantsToDb(postCode)
        .then(() => {
          // After addRestaurantsToDb finishes, get the restaurant data
          return getRestaurants(postCode);
        })
        .then((response) => {
          // After getRestaurants finishes, update the view
          allRestaurantsLong = response;
          updateView(response);
        });
    } else {
      getRestaurants(postCode).then((response) => {
        allRestaurantsLong = response;
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

  for (let i = 1; i < 10; i++) {
    // Calculate which listing data to use
    let listingToUse = i + listingOffset - 1;

    // Store the restaurant id
    let restID = allRestaurantsJSON[0][listingToUse].id;

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
    getFirstValidCuisineImage(cuisineArray, restID).then((imageUrl) => {
      listingElement.style.backgroundImage = `url('${imageUrl}')`;
    });

    // Update restaurant id
    listingElement.dataset.restaurantID = restID;
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

  // Disable the navigation buttons if necessary
  checkNavigationButtons();
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
const getFirstValidCuisineImage = (cuisineArray, restID) => {
  const findValidImage = async () => {
    for (const cuisine of cuisineArray) {
      if (cuisine != "Halal") {
        let rNum = (restID % 5) + 1;
        const imageUrl = `https://just-eat-prod-eu-res.cloudinary.com/image/upload/c_fill,f_auto,q_auto,w_425,d_uk:cuisines:${cuisine.trim()}-${rNum}.jpg/v1/uk/restaurants`;
        const isValid = await isImageOk(imageUrl);
        if (isValid) {
          return imageUrl;
        }
      }
    }
    // If no valid cuisine image is found, return a default image URL
    return "https://d15shllkswkct0.cloudfront.net/wp-content/blogs.dir/1/files/2022/04/Image-8.png";
  };

  return findValidImage();
};

const updateAreaPin = (postCode) => {
  displayedArea.textContent = postCode;
};

const viewNextRestaurants = (direction) => {
  listingOffset += direction;
  updateView(allRestaurantsLong);
};

leftArrow.addEventListener("click", () => {
  viewNextRestaurants(-9);
});
rightArrow.addEventListener("click", () => {
  viewNextRestaurants(9);
});

const checkNavigationButtons = () => {
  if (listingOffset == 0) {
    // Disable left navigation button
    leftArrow.style.pointerEvents = "none";
    leftArrow.style.opacity = "0.5";
    leftArrow.style.cursor = "default";
  } else {
    // Enable left navigation button
    leftArrow.style.pointerEvents = "auto";
    leftArrow.style.opacity = "1";
    leftArrow.style.cursor = "pointer";
  }

  // Add functionality to disable right arrow if at end
};
// Add event listeners for listings
const listing1 = document.getElementById("listing1");
const listing2 = document.getElementById("listing2");
const listing3 = document.getElementById("listing3");
const listing4 = document.getElementById("listing4");
const listing5 = document.getElementById("listing5");
const listing6 = document.getElementById("listing6");
const listing7 = document.getElementById("listing7");
const listing8 = document.getElementById("listing8");
const listing9 = document.getElementById("listing9");

listing1.addEventListener("click", () => {
  // Get the restaurant that was clicked
  let selectedRestaurantID = listing1.dataset.restaurantID;
  // Load next screen with restaurant info
  loadNextScreen(selectedRestaurantID);
});

listing2.addEventListener("click", () => {
  // Get the restaurant that was clicked
  let selectedRestaurantID = listing2.dataset.restaurantID;
  // Load next screen with restaurant info
  loadNextScreen(selectedRestaurantID);
});

listing3.addEventListener("click", () => {
  // Get the restaurant that was clicked
  let selectedRestaurantID = listing3.dataset.restaurantID;
  // Load next screen with restaurant info
  loadNextScreen(selectedRestaurantID);
});

listing4.addEventListener("click", () => {
  // Get the restaurant that was clicked
  let selectedRestaurantID = listing4.dataset.restaurantID;
  // Load next screen with restaurant info
  loadNextScreen(selectedRestaurantID);
});

listing5.addEventListener("click", () => {
  // Get the restaurant that was clicked
  let selectedRestaurantID = listing5.dataset.restaurantID;
  // Load next screen with restaurant info
  loadNextScreen(selectedRestaurantID);
});

listing6.addEventListener("click", () => {
  // Get the restaurant that was clicked
  let selectedRestaurantID = listing6.dataset.restaurantID;
  // Load next screen with restaurant info
  loadNextScreen(selectedRestaurantID);
});

listing7.addEventListener("click", () => {
  // Get the restaurant that was clicked
  let selectedRestaurantID = listing7.dataset.restaurantID;
  // Load next screen with restaurant info
  loadNextScreen(selectedRestaurantID);
});

listing8.addEventListener("click", () => {
  // Get the restaurant that was clicked
  let selectedRestaurantID = listing8.dataset.restaurantID;
  // Load next screen with restaurant info
  loadNextScreen(selectedRestaurantID);
});

listing9.addEventListener("click", () => {
  // Get the restaurant that was clicked
  let selectedRestaurantID = listing9.dataset.restaurantID;
  // Load next screen with restaurant info
  loadNextScreen(selectedRestaurantID);
});

// Load restaurant info screen and pass it the restaurant id
const loadNextScreen = (selectedRestaurantID) => {
  const nextPage = `./restaurantInfoView.html?id=${encodeURIComponent(
    selectedRestaurantID
  )}&postcode=${globalPostCode}`;
  window.location.href = nextPage;
};
