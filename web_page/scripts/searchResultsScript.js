/* GLOBAL VARIABLES */
const SERVER_URL = `http://localhost:5500`; // Set the db server URL
let listingOffset = 0; // Offset for restaurants being shown calculation
let allRestaurantsLong; // Stores all restaurants from a search
let globalPostCode; // Store postCode of current search

/* GET ELEMENTS FROM DOM */
// Logo
const jetLogo = document.querySelector(".jet-logo");
// Address
const displayedArea = document.querySelector(".location-name span");
// Navigation Buttons
const leftArrow = document.querySelector("#nav-btn-1");
const rightArrow = document.querySelector("#nav-btn-2");
// Listings
const listing1 = document.getElementById("listing1");
const listing2 = document.getElementById("listing2");
const listing3 = document.getElementById("listing3");
const listing4 = document.getElementById("listing4");
const listing5 = document.getElementById("listing5");
const listing6 = document.getElementById("listing6");
const listing7 = document.getElementById("listing7");
const listing8 = document.getElementById("listing8");
const listing9 = document.getElementById("listing9");
// Filter Button
const filterMenu = document.querySelector(".filter-menu");
const filterChevron = document.querySelector(".icon-holder");
// Dropdown Menu
const filterDropdown = document.querySelector(".filter-dropdown");
// Radio buttons
const radioBtn1 = document.getElementById("radio-option-1");
const radioBtn2 = document.getElementById("radio-option-2");
const radioBtn3 = document.getElementById("radio-option-3");
// Reset button
const resetFilterBtn = document.querySelector(".reset-radio-btn");

/* EVENT LISTENERS */
// Go to home screen
jetLogo.addEventListener("click", () => {
  window.location.href = "./indexView.html";
});
// Display the filter menu
filterMenu.addEventListener("click", () => {
  // Rotate the chevron
  filterChevron.classList.toggle("rotated");
  // Display the dropdown
  filterDropdown.classList.toggle("shown");
  filterDropdown.classList.toggle("hidden");
});
// Add event listeners to the radio buttons
radioBtn1.addEventListener("click", handleRadioClick);
radioBtn2.addEventListener("click", handleRadioClick);
radioBtn3.addEventListener("click", handleRadioClick);
// Radio button function
function handleRadioClick(event) {
  const selectedOption = event.target.value;
  // Perform actions based on the selected option
  switch (selectedOption) {
    case "Breakfast":
      // Do something for breakfast
      console.log("Breakfast option selected");
      break;
    case "Lunch":
      // Do something for lunch
      console.log("Lunch option selected");
      break;
    case "Dinner":
      // Do something for dinner
      console.log("Dinner option selected");
      break;
  }
}
// Add event listener to the reset button
resetFilterBtn.addEventListener("click", () => {
  radioBtn1.checked = false;
  radioBtn2.checked = false;
  radioBtn3.checked = false;
});
// View previous restaurants
leftArrow.addEventListener("click", () => {
  viewNextRestaurants(-9);
});
// View next restaurants
rightArrow.addEventListener("click", () => {
  viewNextRestaurants(9);
});
// Show listing 1 info
listing1.addEventListener("click", () => {
  let selectedRestaurantID = listing1.dataset.restaurantID;
  let selectedRestaurantPosition = listing1.dataset.positionInJSON;
  loadNextScreen(selectedRestaurantID, selectedRestaurantPosition);
});
// Show listing 2 info
listing2.addEventListener("click", () => {
  let selectedRestaurantID = listing2.dataset.restaurantID;
  let selectedRestaurantPosition = listing2.dataset.positionInJSON;
  loadNextScreen(selectedRestaurantID, selectedRestaurantPosition);
});
// Show listing 3 info
listing3.addEventListener("click", () => {
  let selectedRestaurantID = listing3.dataset.restaurantID;
  let selectedRestaurantPosition = listing3.dataset.positionInJSON;

  loadNextScreen(selectedRestaurantID, selectedRestaurantPosition);
});
// Show listing 4 info
listing4.addEventListener("click", () => {
  let selectedRestaurantID = listing4.dataset.restaurantID;
  let selectedRestaurantPosition = listing4.dataset.positionInJSON;
  loadNextScreen(selectedRestaurantID, selectedRestaurantPosition);
});
// Show listing 5 info
listing5.addEventListener("click", () => {
  let selectedRestaurantID = listing5.dataset.restaurantID;
  let selectedRestaurantPosition = listing5.dataset.positionInJSON;
  loadNextScreen(selectedRestaurantID, selectedRestaurantPosition);
});
// Show listing 6 info
listing6.addEventListener("click", () => {
  let selectedRestaurantID = listing6.dataset.restaurantID;
  let selectedRestaurantPosition = listing6.dataset.positionInJSON;
  loadNextScreen(selectedRestaurantID, selectedRestaurantPosition);
});
// Show listing 7 info
listing7.addEventListener("click", () => {
  let selectedRestaurantID = listing7.dataset.restaurantID;
  let selectedRestaurantPosition = listing7.dataset.positionInJSON;
  loadNextScreen(selectedRestaurantID, selectedRestaurantPosition);
});
// Show listing 8 info
listing8.addEventListener("click", () => {
  let selectedRestaurantID = listing8.dataset.restaurantID;
  let selectedRestaurantPosition = listing8.dataset.positionInJSON;
  loadNextScreen(selectedRestaurantID, selectedRestaurantPosition);
});
// Show listing 9 info
listing9.addEventListener("click", () => {
  let selectedRestaurantID = listing9.dataset.restaurantID;
  let selectedRestaurantPosition = listing9.dataset.positionInJSON;
  loadNextScreen(selectedRestaurantID, selectedRestaurantPosition);
});

/* When window loads, do the following:
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
  // Update the displayed area
  updateAreaPin(postCode);
  // Check if restaurants association with postCode are in db yet or not
  checkPostcodeExists(postCode).then((exists) => {
    if (exists === "false") {
      // Add the restaurants to the db
      addRestaurantsToDb(postCode)
        .then(() => {
          // After addRestaurantsToDb finishes, get the restaurant data
          return getRestaurants(postCode);
        })
        .then((response) => {
          // After getRestaurants finishes, update the display
          allRestaurantsLong = response;
          updateView(response);
        });
    } else {
      getRestaurants(postCode).then((response) => {
        // Update the display
        allRestaurantsLong = response;
        updateView(response);
      });
    }
  });
});

/* SERVER REQUEST FUNCTIONS */
// Call dbHandler.js checkPostcodeExists() via server
const checkPostcodeExists = (postCode) => {
  let queryURL = `${SERVER_URL}/checkExists/${postCode}`;
  return fetch(queryURL, {})
    .then((response) => response.text())
    .then((text) => {
      return text; // true or false
    });
};
// Call dbHandler.js addListings() via server
const addRestaurantsToDb = (postCode) => {
  let queryURL = `${SERVER_URL}/add-restaurants/${postCode}`;
  return fetch(queryURL, {})
    .then((response) => response.text())
    .then((text) => {
      return text; // All added restaurants associated with postCode
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

/* GENERAL FUNCTIONS */
// Change grid elements to show restaurant data
const updateView = (allRestaurants) => {
  // Get JSON or restaurants
  let allRestaurantsJSON = JSON.parse(allRestaurants);
  // Update the grid
  for (let i = 1; i < 10; i++) {
    // Calculate which listing data to use
    let listingToUse = i + listingOffset - 1;
    // Store the restaurant id
    let restID = allRestaurantsJSON[0][listingToUse].id;
    // Get elements from the DOM
    const listingElement = document.getElementById(`listing${i}`);
    const imgElement = listingElement.querySelector(".restaurant-image img");
    const nameSpan = listingElement.querySelector(".restaurant-name span");
    const ratingSpan = listingElement.querySelector(".restaurant-rating span");
    const cuisinesSpan = listingElement.querySelector(
      ".restaurant-cuisines span"
    );
    const addressSpan = listingElement.querySelector(
      ".restaurant-address span"
    );
    const cuisineArray =
      allRestaurantsJSON[0][listingToUse].Cuisines.split(" | ");
    // Update the elements
    listingElement.dataset.positionInJSON = listingToUse;
    listingElement.dataset.restaurantID = restID;
    imgElement.src = allRestaurantsJSON[0][listingToUse].LogoURL;
    nameSpan.textContent = allRestaurantsJSON[0][listingToUse].RestaurantName;
    ratingSpan.textContent = allRestaurantsJSON[0][listingToUse].Rating;
    cuisinesSpan.textContent = allRestaurantsJSON[0][listingToUse].Cuisines;
    addressSpan.textContent = allRestaurantsJSON[0][listingToUse].Address;
    // Get a valid cuisine image and updatet the background food image
    getFirstValidCuisineImage(cuisineArray, restID).then((imageUrl) => {
      listingElement.style.backgroundImage = `url('${imageUrl}')`;
    });
  }
  // Disable the navigation buttons if necessary
  checkNavigationButtons();
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

// Updates the location next to the area pin
const updateAreaPin = (postCode) => {
  displayedArea.textContent = postCode;
};
// Displays the previous or next restaurants (9)
const viewNextRestaurants = (direction) => {
  listingOffset += direction;
  updateView(allRestaurantsLong);
};

// Check if the navigation buttons need to be disabled/enabled
const checkNavigationButtons = () => {
  // LEFT BUTTON
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
  // TODO: Add check for right button at end of list
};

// Load restaurantInfoView with the selected restaurant's ID
const loadNextScreen = (selectedRestaurantID, selectedRestaurantPosition) => {
  const nextPage = `./restaurantInfoView.html?id=${encodeURIComponent(
    selectedRestaurantID
  )}&postcode=${encodeURIComponent(
    globalPostCode
  )}&jsonPosition=${encodeURIComponent(selectedRestaurantPosition)}`;
  window.location.href = nextPage;
};
