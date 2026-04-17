const mysql = require('mysql2');

function trimEnv(key) {
  const v = process.env[key];
  if (v == null) return '';
  return String(v).trim();
}

function railwaySsl() {
  return process.env.RAILWAY_ENVIRONMENT
    ? { ssl: { rejectUnauthorized: false } }
    : {};
}

function isLocalhost(host) {
  if (!host) return true;
  const h = host.toLowerCase();
  return h === 'localhost' || h === '127.0.0.1' || h === '::1';
}

function poolConfig() {
  const urlRaw =
    trimEnv('MYSQL_URL') || trimEnv('DATABASE_URL');
  if (urlRaw && /^mysql:\/\//i.test(urlRaw)) {
    return urlRaw;
  }

  let host =
    trimEnv('MYSQLHOST') ||
    trimEnv('MYSQL_HOST') ||
    trimEnv('MYSQL_ADDRESS');
  const user =
    trimEnv('MYSQLUSER') ||
    trimEnv('MYSQL_USER') ||
    trimEnv('MYSQLUSERNAME');
  const password =
    trimEnv('MYSQLPASSWORD') || trimEnv('MYSQL_PASSWORD');
  const database =
    trimEnv('MYSQLDATABASE') ||
    trimEnv('MYSQL_DATABASE') ||
    trimEnv('MYSQL_DB');
  const port = Number(
    trimEnv('MYSQLPORT') || trimEnv('MYSQL_PORT') || '3306'
  );

  if (process.env.RAILWAY_ENVIRONMENT && isLocalhost(host)) {
    host = '';
  }

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

  return {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'e_commerce_js',
  };
}

const resolvedConfig = poolConfig();
if (typeof resolvedConfig === 'string') {
  console.log('[database] MySQL via MYSQL_URL / URL de connexion');
} else if (process.env.RAILWAY_ENVIRONMENT) {
  console.log(
    '[database] MySQL host:',
    resolvedConfig.host,
    resolvedConfig.host === 'localhost'
      ? '⚠ encore localhost → les variables MYSQL* ne sont pas visibles par Node. Vérifie Variables + redéploiement.'
      : '(OK)'
  );
}

if (process.env.RAILWAY_ENVIRONMENT) {
  const has =
    trimEnv('MYSQLHOST') ||
    trimEnv('MYSQL_HOST') ||
    trimEnv('MYSQL_URL') ||
    (trimEnv('DATABASE_URL') && /^mysql:/i.test(trimEnv('DATABASE_URL')));
  if (!has) {
    console.error(
      '[Boutique] Aucune variable MySQL utile au runtime. Sur BoutiqueJS → Variables : ajoute par ex. MYSQL_URL = ${{ MySQL.MYSQL_URL }} puis Apply / Deploy.'
    );
  }
}

const pool = mysql.createPool(resolvedConfig);

module.exports = pool;
