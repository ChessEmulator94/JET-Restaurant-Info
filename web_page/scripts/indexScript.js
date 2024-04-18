const searchButton = document.querySelector(".searchButton");
const searchBar = document.getElementById("searchBar");

// Set equal to the URL server is running on
const SERVER_URL = `http://localhost:5500`;

searchButton.addEventListener("click", () => {
  // Get post code from screen
  let postCode = document.getElementById("searchBar").value;
  searchBar.value = "";
  getRestaurants(postCode);
  // if (validatePostCode(postCode)) {
  //   window.location.href = "./Manage Heroes/manage.html";
  // }
});

const validatePostCode = (postCode) => {
  // Check if postcode exists
};

const getRestaurants = (postCode) => {
  let queryURL = `${SERVER_URL}/restaurants/${postCode}`;
  return fetch(queryURL, {})
    .then((response) => response.text())
    .then((text) => {
      console.log(text);
    });
};
