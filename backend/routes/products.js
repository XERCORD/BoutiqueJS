
const express = require('express');
const router = express.Router();
const controllers = require('../controllers/products');

router.get('/products', controllers.getProducts);
router.get('/products/:id', controllers.getProductById);
router.get('/products/languages/:id', controllers.getProductsByLanguage);
router.get('/products/categories/:id', controllers.getProductsByCategories);
router.get('/products/licence/:id', controllers.getProductByLicence);
router.get('/products/editions/:id', controllers.getProductByEdition);
router.get('/products/states/:id', controllers.getProductByState);
router.get('/boosters', controllers.getBoosters);
router.get('/categories', controllers.getCategories);
router.get('/products/search/:name', controllers.searchProductsByName);
router.post('/update-stock', controllers.updateStock);
router.get('/products/promotion', controllers.getProductsByPromo);


router.get('*', (req, res) => {
  res.status(404).json({ message: '404 Not Found' });
});





module.exports = router;
