CREATE DATABASE e_commerce_js
DEFAULT CHARACTER SET latin1
DEFAULT COLLATE latin1_bin;

USE e_commerce_js;

CREATE TABLE users(
   users_id INT AUTO_INCREMENT,
   username VARCHAR(20),
   passwords VARCHAR(20) NOT NULL,
   email VARCHAR(50) NOT NULL,
   adress VARCHAR(255),
   PRIMARY KEY(users_id),
   UNIQUE(email)
);

CREATE TABLE cart(
   cart_id INT AUTO_INCREMENT,
   total_price DECIMAL(15,2),
   users_id INT NOT NULL,
   PRIMARY KEY(cart_id),
   UNIQUE(users_id),
   FOREIGN KEY(users_id) REFERENCES users(users_id)
);

CREATE TABLE categories(
   categories_id INT AUTO_INCREMENT,
   name VARCHAR(20),
   PRIMARY KEY(categories_id)
);

CREATE TABLE langage(
   langage_id INT AUTO_INCREMENT,
   name VARCHAR(50),
   PRIMARY KEY(langage_id)
);

CREATE TABLE state(
   state_id INT AUTO_INCREMENT,
   name VARCHAR(50),
   PRIMARY KEY(state_id)
);

CREATE TABLE Licence(
   licence_id INT AUTO_INCREMENT,
   name VARCHAR(50),
   PRIMARY KEY(licence_id)
);

CREATE TABLE edition(
   edition_id INT AUTO_INCREMENT,
   name VARCHAR(50),
   PRIMARY KEY(edition_id)
);

CREATE TABLE products(
   products_id INT AUTO_INCREMENT,
   name VARCHAR(255),
   price DECIMAL(15,2),
   stock INT,
   image_url VARCHAR(255),
   image_url2 VARCHAR(255),
   image_url3 VARCHAR(255),
   image_url4 VARCHAR(255),
   description TEXT,
   illustrations VARCHAR(50),
   réduction DECIMAL(15,2),
   edition_id INT NOT NULL,
   licence_id INT NOT NULL,
   state_id INT NOT NULL,
   langage_id INT NOT NULL,
   categories_id INT NOT NULL,
   PRIMARY KEY(products_id),
   FOREIGN KEY(edition_id) REFERENCES edition(edition_id),
   FOREIGN KEY(licence_id) REFERENCES Licence(licence_id),
   FOREIGN KEY(state_id) REFERENCES state(state_id),
   FOREIGN KEY(langage_id) REFERENCES langage(langage_id),
   FOREIGN KEY(categories_id) REFERENCES categories(categories_id)
);

CREATE TABLE contient(
   products_id INT AUTO_INCREMENT,
   cart_id INT,
   PRIMARY KEY(products_id, cart_id),
   FOREIGN KEY(products_id) REFERENCES products(products_id),
   FOREIGN KEY(cart_id) REFERENCES cart(cart_id)
);
