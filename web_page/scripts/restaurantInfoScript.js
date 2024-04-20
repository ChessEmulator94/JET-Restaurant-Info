// Change based on actual server URL
const SERVER_URL = `http://localhost:5500`;

let allRestaurantsJSON;
let restaurant;
let restaurantPositionInJSON;
let globalPostCode;

/* GET DOM ELEMENTS */
const locationMapIframe = document.querySelector(".restaurantPin");
const restaurantLogo = document.querySelector(".logo");
const restaurantName = document.querySelector(".restaurant-name span");
const restaurantRating = document.querySelector(".rating span");
const restaurantCuisines = document.querySelector(".cuisines span");
const restaurantAddress = document.querySelector(".address span");
const leftNavBtn = document.getElementById("nav-left");
const rightNavBtn = document.getElementById("nav-right");

leftNavBtn.addEventListener("click", () => {
  changeRestaurant(-1);
  updateDisplayedRestaurant(allRestaurantsJSON[0][restaurantPositionInJSON]);
});

rightNavBtn.addEventListener("click", () => {
  changeRestaurant(1);
  console.log(allRestaurantsJSON[0][restaurantPositionInJSON].id);
  updateDisplayedRestaurant(allRestaurantsJSON[0][restaurantPositionInJSON]);
});

// On load of webpage
document.addEventListener("DOMContentLoaded", () => {
  // Get the value of the "id" query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const restaurantID = urlParams.get("id");
  // Get the value of the "postcode" query parameter from the URL
  globalPostCode = urlParams.get("postcode");

  getRestaurantInfo(restaurantID).then((response) => {
    const restaurant = JSON.parse(response);
    updateDisplayedRestaurant(restaurant);
    findRestaurantPosition(restaurantID, globalPostCode);
  });
});

// Call dbHandler.js getRestaurantInfo() via the server
const getRestaurantInfo = (id) => {
  let queryURL = `${SERVER_URL}/restaurant/${id}`;
  return fetch(queryURL, {})
    .then((response) => (response = response.text()))
    .then((text) => {
      return text;
    });
};

// Call dbHandler.js getRestaurants() via server
const getRestaurants = (postCode) => {
  let queryURL = `${SERVER_URL}/restaurants/${postCode}`;
  return fetch(queryURL, {})
    .then((response) => response.text())
    .then((text) => {
      return text; // All restaurants association with postCode
    });
};

// Changes the displayed restaurant forward or backwards
const changeRestaurant = (direction) => {
  if (direction == 1) {
    // Direction (right)
    // Show next listing or listing[0] if at last listing
    if (restaurantPositionInJSON == allRestaurantsJSON[0].length - 1) {
      restaurantPositionInJSON = 0;
    } else {
      restaurantPositionInJSON += 1;
    }
  } else {
    // Direction == -1 (left)
    // Show prev listing or last if at listing 0
    if (restaurantPositionInJSON == 0) {
      restaurantPositionInJSON = allRestaurantsJSON[0].length;
    } else {
      restaurantPositionInJSON -= 1;
    }
  }
};

// Determines which restaurant was selected
const findRestaurantPosition = (restaurantID, postCode) => {
  // Get all restaurants associated with postCode
  getRestaurants(postCode).then((response) => {
    let allRestaurants = response;
    console.log(allRestaurants);
    // Get JSON of restaurants
    allRestaurantsJSON = JSON.parse(allRestaurants);
    // Get the index of thte restaurant within the JSON
    restaurantPositionInJSON = allRestaurantsJSON[0].findIndex(
      (restaurant) => restaurant.id == restaurantID
    );
  });
};

const updateDisplayedRestaurant = (restaurant) => {
  // Update logo
  restaurantLogo.style.backgroundImage = `url(${restaurant.LogoURL})`;

  // Update name
  restaurantName.textContent = restaurant.RestaurantName;

  // Update rating
  restaurantRating.textContent = `Rating ${restaurant.Rating}`;

  if (restaurant.hasOwnProperty("Cuisines")) {
    restaurantCuisines.textContent = restaurant.Cuisines;
  } else if (restaurant.hasOwnProperty("cuisines")) {
    restaurantCuisines.textContent = restaurant.cuisines.join(" | ");
  }

  // Update address
  restaurantAddress.textContent = restaurant.Address;

  // Get the <iframe> element
  // Update the src attribute of the <iframe>
  locationMapIframe.src = `https://www.google.com/maps?q=[${restaurant.Address}]&output=embed`;
};
