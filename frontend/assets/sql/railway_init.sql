-- Initialisation Railway — lire ce bloc commentaire d'abord.
--
-- Méthode fiable (recommandée) : depuis ton PC, dans backend/ :
--   $env:MYSQL_URL = "mysql://…"   # copie depuis MySQL → Connect
--   npm run import-sql
--
-- Sur Railway (MySQL → Data), l’éditeur exécute souvent UNE SEULE requête par clic.
-- Si tu colles tout le fichier : seul le début part → "succès" mais SHOW TABLES reste vide.
--
-- À faire : pour chaque "-- BLOC" ci‑dessous, sélectionne TOUT le CREATE (du CREATE au ; final)
-- puis Run. Répète pour les blocs 1 → 9 dans l’ordre.
--
-- Ensuite : 4images.sql (un INSERT sélectionné à la fois, dans l’ordre), puis 1image.sql (un seul Run).

-- BLOC 1
CREATE TABLE railway.users(
   users_id INT AUTO_INCREMENT,
   username VARCHAR(20),
   passwords VARCHAR(20) NOT NULL,
   email VARCHAR(50) NOT NULL,
   adress VARCHAR(255),
   PRIMARY KEY(users_id),
   UNIQUE(email)
);

-- BLOC 2
CREATE TABLE railway.cart(
   cart_id INT AUTO_INCREMENT,
   total_price DECIMAL(15,2),
   users_id INT NOT NULL,
   PRIMARY KEY(cart_id),
   UNIQUE(users_id),
   FOREIGN KEY(users_id) REFERENCES railway.users(users_id)
);

-- BLOC 3
CREATE TABLE railway.categories(
   categories_id INT AUTO_INCREMENT,
   name VARCHAR(20),
   PRIMARY KEY(categories_id)
);

-- BLOC 4
CREATE TABLE railway.langage(
   langage_id INT AUTO_INCREMENT,
   name VARCHAR(50),
   PRIMARY KEY(langage_id)
);

-- BLOC 5
CREATE TABLE railway.state(
   state_id INT AUTO_INCREMENT,
   name VARCHAR(50),
   PRIMARY KEY(state_id)
);

-- BLOC 6
CREATE TABLE railway.Licence(
   licence_id INT AUTO_INCREMENT,
   name VARCHAR(50),
   PRIMARY KEY(licence_id)
);

-- BLOC 7
CREATE TABLE railway.edition(
   edition_id INT AUTO_INCREMENT,
   name VARCHAR(50),
   PRIMARY KEY(edition_id)
);

-- BLOC 8
CREATE TABLE railway.products(
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
   FOREIGN KEY(edition_id) REFERENCES railway.edition(edition_id),
   FOREIGN KEY(licence_id) REFERENCES railway.Licence(licence_id),
   FOREIGN KEY(state_id) REFERENCES railway.state(state_id),
   FOREIGN KEY(langage_id) REFERENCES railway.langage(langage_id),
   FOREIGN KEY(categories_id) REFERENCES railway.categories(categories_id)
);

-- BLOC 9
CREATE TABLE railway.contient(
   products_id INT AUTO_INCREMENT,
   cart_id INT,
   PRIMARY KEY(products_id, cart_id),
   FOREIGN KEY(products_id) REFERENCES railway.products(products_id),
   FOREIGN KEY(cart_id) REFERENCES railway.cart(cart_id)
);
