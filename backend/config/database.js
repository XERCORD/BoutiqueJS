const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'xerly2058',
  database: 'e_commerce_js'
});

module.exports = pool;
