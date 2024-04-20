// Get elements from the DOM
const searchButton = document.querySelector(".searchButton");
const searchBar = document.getElementById("searchBar");

// Set the db server URL
const SERVER_URL = `http://localhost:5500`;

// Add onClick function to search button
searchButton.addEventListener("click", () => {
  // Get post code from screen
  let postCode = document.getElementById("searchBar").value;
  // Reset the search bar
  searchBar.value = "";

  // Check that postcode is valid
  if (validatePostCode(postCode)) {
    const nextPage = `./searchResultsView.html?postCode=${encodeURIComponent(
      postCode
    )}`;
    // Load results window
    window.location.href = nextPage;
  }
});

// Need to implement and move to different file
const validatePostCode = (postCode) => {
  // Check if postcode exists
  // const ukPostcodeRegex = /^([A-Z]{1,2}[0-9][A-Z0-9]?)\s*([0-9][A-Z]{2})$/i;
  // return ukPostcodeRegex.test(postCode);
  return true;
};
