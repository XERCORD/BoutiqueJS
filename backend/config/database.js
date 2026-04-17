const mysql = require('mysql2');

function railwaySsl() {
  return process.env.RAILWAY_ENVIRONMENT
    ? { ssl: { rejectUnauthorized: false } }
    : {};
}

function poolConfig() {
  const host =
    process.env.MYSQLHOST ||
    process.env.MYSQL_HOST ||
    process.env.MYSQL_ADDRESS;
  const user =
    process.env.MYSQLUSER || process.env.MYSQL_USER || process.env.MYSQLUSERNAME;
  const password =
    process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || '';
  const database =
    process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || process.env.MYSQL_DB;
  const port = Number(
    process.env.MYSQLPORT || process.env.MYSQL_PORT || 3306
  );

  if (host) {
    return {
      host,
      user,
      password,
      database,
      port,
      ...railwaySsl(),
    };
  }

  const url = process.env.MYSQL_URL || process.env.DATABASE_URL;
  if (url && /^mysql:\/\//i.test(String(url))) {
    return url;
  }

  return {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'e_commerce_js',
  };
}

if (process.env.RAILWAY_ENVIRONMENT) {
  const hasRailwayMysql =
    process.env.MYSQLHOST ||
    process.env.MYSQL_HOST ||
    process.env.MYSQL_ADDRESS ||
    (process.env.MYSQL_URL && /^mysql:/i.test(process.env.MYSQL_URL)) ||
    (process.env.DATABASE_URL && /^mysql:/i.test(process.env.DATABASE_URL));
  if (!hasRailwayMysql) {
    console.error(
      '[Boutique] MySQL non configuré sur Railway. Service Web → Variables → « New Variable » → « Variable Reference » → choisir la base MySQL et ajouter MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, MYSQLPORT (ou MYSQL_URL).'
    );
  }
}

const pool = mysql.createPool(poolConfig());

module.exports = pool;
