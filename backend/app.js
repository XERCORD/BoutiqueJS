const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const port = 3000;

app.use(cors());
const productsRoutes = require('./routes/products');
app.use(express.json());

// Servir les fichiers statiques (CSS, JS, images)
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Routes API
app.use('/api', productsRoutes);

// Routes pour chaque page HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/index.html'));
});

app.get('/allproducts', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/allproducts.html'));
});

app.get('/article', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/article.html'));
});

app.get('/panier', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/panier.html'));
});

app.get('/favorite', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/favorite.html'));
});

app.get('/promotions', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/promotions.html'));
});

app.get('/recherche', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/recherche.html'));
});

app.get('/licence', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/licence.html'));
});

app.get('/categorie', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/categorie.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/contact.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/about.html'));
});

app.get('/paiment', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/paiment.html'));
});

app.get('/confirmation', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/confirmation.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});