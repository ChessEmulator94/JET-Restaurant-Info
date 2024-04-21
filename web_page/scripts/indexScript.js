// Get elements from the DOM
const searchButton = document.querySelector(".search-btn");
const searchBar = document.querySelector(".search-input");

// Set the db server URL
const SERVER_URL = `http://localhost:5500`;

// Add onClick function to search button
searchButton.addEventListener("click", () => {
  submitSearch();
});

searchBar.addEventListener("keyup", (event) => {
  // If the Enter key was pressed
  if (event.key === "Enter") {
    submitSearch();
  }
});

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
    console.log("Invalid postcode");
  }
};

// Validates if postCode provided follows correct format
const validatePostCode = (postCode) => {
  // Check if postcode exists
  const ukPostcodeRegex = /^([A-Z]{1,2}[0-9][A-Z0-9]?)\s*([0-9][A-Z]{2})$/i;
  return ukPostcodeRegex.test(postCode);
};
