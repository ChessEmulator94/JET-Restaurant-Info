// Change based on actual server URL
const SERVER_URL = `http://localhost:5500`;

let restaurant;

let globalPostCode;

// Call dbHandler.js getRestaurantInfo() via the server
const getRestaurantInfo = (id) => {
  let queryURL = `${SERVER_URL}/restaurant/${id}`;
  return fetch(queryURL, {})
    .then((response) => (response = response.text()))
    .then((text) => {
      return text;
    });
};

const locationMapIframe = document.querySelector(".restaurantPin");
const restaurantLogo = document.querySelector(".logo");
const restaurantName = document.querySelector(".restaurant-name span");
const restaurantRating = document.querySelector(".rating span");
const restaurantCuisines = document.querySelector(".cuisines span");
const restaurantAddress = document.querySelector(".address span");

// On load of webpage
document.addEventListener("DOMContentLoaded", () => {
  // Get the value of the "id" query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const restaurantID = urlParams.get("id");
  globalPostCode = urlParams.get("postcode");

  getRestaurantInfo(restaurantID).then((response) => {
    const restaurant = JSON.parse(response);
    updateDisplayedRestaurant(restaurant);
  });
});

const updateDisplayedRestaurant = (restaurant) => {
  console.log(restaurant);
  // Update logo
  restaurantLogo.style.backgroundImage = `url(${restaurant.LogoURL})`;

  // Update name
  restaurantName.textContent = restaurant.RestaurantName;

  // Update rating
  restaurantRating.textContent = `Rating ${restaurant.Rating}`;

  // Update cuisines
  restaurantCuisines.textContent = restaurant.cuisines.join(" | ");

  // Update address
  restaurantAddress.textContent = restaurant.Address;

  // Get the <iframe> element
  // Update the src attribute of the <iframe>
  locationMapIframe.src = `https://www.google.com/maps?q=[${restaurant.Address}]&output=embed`;
};
