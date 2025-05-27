const { query } = require('express');
const pool = require('../config/database');
const e = require('express');

exports.getProducts = (req, res) => {
    const query = `
    SELECT p.*, c.name as category_name, l.name as licence_name, g.name as langage_name, e.name as edition_name, réduction
    FROM products p
    JOIN categories c ON p.categories_id = c.categories_id
    JOIN Licence l ON p.licence_id = l.licence_id
    JOIN langage g ON p.langage_id = g.langage_id
    JOIN edition e ON p.edition_id = e.edition_id
    `;
    pool.query(query, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(results);
    });
  };


exports.getProductById = (req, res) => {
  const { id } = req.params;
  const query = `
  SELECT p.*, 
         e.name as edition_name, 
         l.name as licence_name, 
         s.name as state_name, 
         g.name as langage_name, 
         c.name as category_name
  FROM products p
  JOIN edition e ON p.edition_id = e.edition_id
  JOIN Licence l ON p.licence_id = l.licence_id
  JOIN state s ON p.state_id = s.state_id
  JOIN langage g ON p.langage_id = g.langage_id
  JOIN categories c ON p.categories_id = c.categories_id
  WHERE p.products_id = ?
  `;

  pool.query(query, [id], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(results[0]);
  });
};

exports.getProductsByCategories = (req, res) => {
    const { id } = req.params;
    const query = `
    SELECT p.*, c.name as category_name, l.name as licence_name
    FROM products p
    JOIN categories c ON p.categories_id = c.categories_id
    JOIN Licence l ON p.licence_id = l.licence_id
    WHERE p.categories_id = ?
    `;
    pool.query(query, [id], (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(results);
    });
  }

  exports.getProductsByLanguage = (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM products WHERE langage_id = ?', [id], (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(results);
    });
  }

  exports.getProductByState = (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM products WHERE state_id = ?', [id], (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(results);
    });
  }

  exports.getProductByLicence = (req, res) => {
    const { id } = req.params;
    const query = `SELECT p.*, c.name as categories_name, l.name as licence_name
    FROM products p
    JOIN categories c ON p.categories_id = c.categories_id
    JOIN Licence l ON p.licence_id = l.licence_id
    WHERE p.licence_id = ?`

    pool.query(query, [id], (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(results);
    });
  }

  exports.getProductByEdition = (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM products WHERE edition_id = ?', [id], (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(results);
    });
  }

exports.getBoosters = (req, res) => {
    pool.query('SELECT * FROM products WHERE categories_id = 1', (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(results);
    });
  };

exports.getCategories = (req, res) => {
  pool.query('SELECT * FROM categories', (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
}

exports.searchProductsByName = (req, res) => {
  const { name } = req.params;
  const searchQuery = `
    SELECT p.*, 
           e.name as edition_name, 
           l.name as licence_name, 
           s.name as state_name, 
           g.name as langage_name, 
           c.name as categories_name
    FROM products p
    LEFT JOIN edition e ON p.edition_id = e.edition_id
    LEFT JOIN licence l ON p.licence_id = l.licence_id
    LEFT JOIN state s ON p.state_id = s.state_id
    LEFT JOIN langage g ON p.langage_id = g.langage_id
    LEFT JOIN categories c ON p.categories_id = c.categories_id
    WHERE LOWER(p.name) LIKE LOWER(?);
  `;
  pool.query(searchQuery, [`%${name}%`], (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
};

exports.getProductsByPromo = (req, res) => {
  pool.query('SELECT * FROM products WHERE réduction IS NOT NULL', (error, results) => {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    res.json(results);
  });
}

exports.updateStock = async (req, res) => {
  const productsToUpdate = req.body;

    try {
        for (const product of productsToUpdate) {
            const productId = product.id;
            const quantity = product.quantity;

            pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Erreur de connexion à la base de données:', err);
                    return res.status(500).json({ error: 'Erreur de connexion à la base de données' });
                }

                const sql = 'UPDATE products SET stock = stock - ? WHERE products_id = ?';
                connection.query(sql, [quantity, productId], (error, results) => {
                    connection.release();

                    if (error) {
                        console.error('Erreur lors de la mise à jour du stock:', error);
                        return res.status(500).json({ error: 'Erreur lors de la mise à jour du stock' });
                    }

                    console.log(`Stock mis à jour pour le produit avec ID ${productId}`);
                });
            });
        }

        res.json({ message: 'Stock mis à jour avec succès' });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du stock:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du stock' });
    }
}
