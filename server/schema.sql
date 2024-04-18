-- Drop the database if it exists
DROP DATABASE IF EXISTS restaurantsDB;

-- Create the database
CREATE DATABASE restaurantsDB;
USE restaurantsDB;

-- Drop tables if they exist
DROP TABLE IF EXISTS RestaurantPostCodes;
DROP TABLE IF EXISTS PostCodes;
DROP TABLE IF EXISTS RestaurantCuisines;
DROP TABLE IF EXISTS Cuisines;
DROP TABLE IF EXISTS Restaurants;

-- Table 1: Restaurants
CREATE TABLE Restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  RestaurantName VARCHAR(255) NOT NULL,
  Rating DECIMAL(2,1),
  Address VARCHAR(255),
  LogoURL VARCHAR(255),
  RestaurantID INT UNIQUE
);

-- Table 2: Cuisines
CREATE TABLE Cuisines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  Cuisine VARCHAR(100) NOT NULL
);

-- Table 3: RestaurantCuisines
CREATE TABLE RestaurantCuisines (
  RestaurantID INT NOT NULL,
  CuisineID INT NOT NULL,
  PRIMARY KEY (RestaurantID, CuisineID),
  FOREIGN KEY (RestaurantID) REFERENCES Restaurants(RestaurantID),
  FOREIGN KEY (CuisineID) REFERENCES Cuisines(id)
);

-- Table 4: PostCodes
CREATE TABLE PostCodes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  PostCode VARCHAR(10) NOT NULL
);

-- Table 5: RestaurantPostCodes
CREATE TABLE RestaurantPostCodes (
  RestaurantID INT NOT NULL,
  PostCodeID INT NOT NULL,
  PRIMARY KEY (RestaurantID, PostCodeID),
  FOREIGN KEY (RestaurantID) REFERENCES Restaurants(RestaurantID),
  FOREIGN KEY (PostCodeID) REFERENCES PostCodes(id)
);