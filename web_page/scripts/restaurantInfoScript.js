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
const topContainer = document.querySelector(".top-container");
// Logo
const jetLogo = document.querySelector(".jet-logo");

/* EVENT LISTENERS */
// Go to home screen
jetLogo.addEventListener("click", () => {
  window.location.href = "./indexView.html";
});
// Left-chevron button
leftNavBtn.addEventListener("click", () => {
  changeRestaurant(-1);
  updateDisplayedRestaurant(allRestaurantsJSON[0][restaurantPositionInJSON]);
  checkNavigationButtons();
});
// Right-chevron button
rightNavBtn.addEventListener("click", () => {
  changeRestaurant(1);
  updateDisplayedRestaurant(allRestaurantsJSON[0][restaurantPositionInJSON]);
  checkNavigationButtons();
});

// On load of webpage
document.addEventListener("DOMContentLoaded", () => {
  // Get the value of the "id" query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const restaurantID = urlParams.get("id");
  // Get the value of the "postcode" query parameter from the URL
  globalPostCode = urlParams.get("postcode");
  // Get the value of the position in the JSON
  restaurantPositionInJSON = parseInt(urlParams.get("jsonPosition"));

  getRestaurantInfo(restaurantID).then((response) => {
    let restaurantInfo = JSON.parse(response);
    updateDisplayedRestaurant(restaurantInfo);
  });

  // Get all restaurants associated with postCode
  getRestaurants(globalPostCode).then((response) => {
    let allRestaurants = response;
    // Get JSON of restaurants
    allRestaurantsJSON = JSON.parse(allRestaurants);
    checkNavigationButtons();
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

// Finds the first valid cuisine image from an array of cuisines
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

// Checks if an image URL returns a 404
const isImageOk = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};

// Updates shown restaurant details
const updateDisplayedRestaurant = (restaurant) => {
  let cuisineArray;
  // Update logo
  restaurantLogo.style.backgroundImage = `url(${restaurant.LogoURL})`;
  // Update name
  restaurantName.textContent = restaurant.RestaurantName;
  // Update rating
  restaurantRating.textContent = `Rating ${restaurant.Rating}`;
  // Account for inconsistency in cuisine property spelling
  if (restaurant.hasOwnProperty("Cuisines")) {
    restaurantCuisines.textContent = restaurant.Cuisines;
    cuisineArray = restaurant.Cuisines.split(" | ");
  } else if (restaurant.hasOwnProperty("cuisines")) {
    restaurantCuisines.textContent = restaurant.cuisines.join(" | ");
    cuisineArray = restaurant.cuisines;
  }
  cuisineArray.sort();
  // Update address
  restaurantAddress.textContent = restaurant.Address;
  // Get the <iframe> element
  // Update the src attribute of the <iframe>
  locationMapIframe.src = `https://www.google.com/maps?q=[${restaurant.Address}]&output=embed`;
  // Get a valid cuisine image and update the background food image
  getFirstValidCuisineImage(cuisineArray, restaurant.id).then((imageUrl) => {
    topContainer.style.backgroundImage = `url('${imageUrl}')`;
  });
};

// Check if the navigation buttons need to be disabled/enabled
const checkNavigationButtons = () => {
  // RIGHT BUTTON
  if (restaurantPositionInJSON == allRestaurantsJSON[0].length - 1) {
    // Disable right navigation button
    rightNavBtn.style.pointerEvents = "none";
    rightNavBtn.style.opacity = "0.5";
    rightNavBtn.style.cursor = "default";
  } else {
    // Enable right navigation button
    rightNavBtn.style.pointerEvents = "auto";
    rightNavBtn.style.opacity = "1";
    rightNavBtn.style.cursor = "pointer";
  }
  // LEFT BUTTON
  if (restaurantPositionInJSON == 0) {
    // Disable left navigation button
    leftNavBtn.style.pointerEvents = "none";
    leftNavBtn.style.opacity = "0.5";
    leftNavBtn.style.cursor = "default";
  } else {
    // Enable left navigation button
    leftNavBtn.style.pointerEvents = "auto";
    leftNavBtn.style.opacity = "1";
    leftNavBtn.style.cursor = "pointer";
  }

  // TODO: Add check for right button at end of list
};
