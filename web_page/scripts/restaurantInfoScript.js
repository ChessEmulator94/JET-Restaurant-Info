// Change based on actual server URL
const SERVER_URL = `http://localhost:5500`;

let restaurant;

// Call dbHandler.js getRestaurantInfo() via the server
const getRestaurantInfo = (id) => {
  let queryURL = `${SERVER_URL}/restaurant/${id}`;
  return fetch(queryURL, {})
    .then((response) => (response = response.text()))
    .then((text) => {
      return text;
    });
};

// On load of webpage
document.addEventListener("DOMContentLoaded", () => {
  // Get the value of the "id" query parameter from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const restaurantID = urlParams.get("id");

  getRestaurantInfo(restaurantID).then((response) => {
    const restaurant = JSON.parse(response);
    // Get the <iframe> element
    const locationMapIframe = document.querySelector(".restaurantPin");
    // Update the src attribute of the <iframe>
    locationMapIframe.src = `https://www.google.com/maps?q=[${restaurant.Address}]&output=embed`;
  });
});
