const mysql = require('mysql2');

function poolConfig() {
  if (process.env.MYSQLHOST) {
    return {
      host: process.env.MYSQLHOST,
      user: process.env.MYSQLUSER,
      password: process.env.MYSQLPASSWORD,
      database: process.env.MYSQLDATABASE,
      port: Number(process.env.MYSQLPORT || 3306),
      ...(process.env.RAILWAY_ENVIRONMENT
        ? { ssl: { rejectUnauthorized: false } }
        : {}),
    };
  }

  return {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'e_commerce_js',
  };
}

const pool = mysql.createPool(poolConfig());

module.exports = pool;
