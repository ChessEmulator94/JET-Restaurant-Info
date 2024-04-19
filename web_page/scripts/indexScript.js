const searchButton = document.querySelector(".searchButton");
const searchBar = document.getElementById("searchBar");

// Set equal to the URL server is running on
const SERVER_URL = `http://localhost:5500`;

searchButton.addEventListener("click", () => {
  // Get post code from screen
  let postCode = document.getElementById("searchBar").value;
  searchBar.value = "";

  if (validatePostCode(postCode)) {
    const nextPage = `./searchResultsView.html?postCode=${encodeURIComponent(
      postCode
    )}`;

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
