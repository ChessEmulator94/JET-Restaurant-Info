class RestaurantObj {
  constructor(id, name, cuisines, rating, logoUrl, address) {
    this.restaurantID = id;
    this.restaurantName = name;
    this.restaurantCuisines = cuisines;
    this.restaurantRating = rating;
    this.restaurantLogo = logoUrl;
    this.restaurantAddress = address;
  }
}

export default RestaurantObj;
