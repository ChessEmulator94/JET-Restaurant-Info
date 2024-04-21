// Get elements from the DOM
const searchButton = document.querySelector(".search-btn");
const searchBar = document.querySelector(".search-input");
const errorMessage = document.querySelector(".error-msg span");

// Set the db server URL
const SERVER_URL = `http://localhost:5500`;

// Add onClick function to search button
searchButton.addEventListener("click", () => {
  submitSearch();
});

// Checks if any text is typed -> removes the error msg
searchBar.addEventListener("input", (event) => {
  // Make error message dissapear
  errorMessage.style.color = "white";
});

// Searches on Enter being pressed
searchBar.addEventListener("keyup", (event) => {
  // If the Enter key was pressed
  if (event.key === "Enter") {
    submitSearch();
  }
});

/* Get postcode from the screen
 * Validate that it's a valid postcode
 *  IF (valid) -> load next screen
 *
 *  ELSE -> Show error message
 */
const submitSearch = () => {
  // Get post code from screen
  let postCode = searchBar.value;
  // Reset the search bar
  searchBar.value = "";
  // Check that postcode is valid
  if (validatePostCode(postCode)) {
    // Remove whitespace
    postCode = postCode.split(" ").join("");
    const nextPage = `./searchResultsView.html?postCode=${encodeURIComponent(
      postCode
    )}`;
    // Load results window
    window.location.href = nextPage;
  } else {
    // Make error message appear
    errorMessage.style.color = "rgb(167, 0, 0)";
  }
};

// Validates if postCode provided follows correct format
const validatePostCode = (postCode) => {
  // Check if postcode exists
  const ukPostcodeRegex = /^([A-Z]{1,2}[0-9][A-Z0-9]?)\s*([0-9][A-Z]{2})$/i;
  return ukPostcodeRegex.test(postCode);
};
