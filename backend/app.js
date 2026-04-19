const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const port = Number(process.env.PORT) || 3000;

app.use(cors());
const productsRoutes = require('./routes/products');
app.use(express.json());

// Servir les fichiers statiques (CSS, JS, images) depuis le dossier assets
app.use('/assets', express.static(path.join(__dirname, '../frontend/assets')));

// Servir les fichiers HTML comme fichiers statiques
app.use(express.static(path.join(__dirname, '../frontend/templates')));

// Routes API
app.use('/api', productsRoutes);

// Routes pour chaque page HTML (optionnel si vous utilisez les fichiers statiques)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/allproducts.html'));
});

app.get('/about.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/about.html'));
});

app.get('/contact.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/contact.html'));
});

app.get('/cgv.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/cgv.html'));
});

app.get('/allproducts.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/allproducts.html'));
});

app.get('/article.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/article.html'));
});

app.get('/panier.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/panier.html'));
});

app.get('/favorite.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/favorite.html'));
});

app.get('/promotions.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/promotions.html'));
});

app.get('/recherche.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/recherche.html'));
});

app.get('/categorie.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/categorie.html'));
});

app.get('/paiment.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/paiment.html'));
});

app.get('/confirmation.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/templates/confirmation.html'));
});

app.listen(port, '0.0.0.0', () => {
  const url = `http://localhost:${port}`;
  console.log(`\n  Boutique prête — ouvre dans le navigateur :\n  ${url}\n`);
});