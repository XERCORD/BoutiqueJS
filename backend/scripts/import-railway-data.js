/**
 * Envoie tout le SQL en une fois (comme le client mysql), sans l’éditeur Railway.
 *
 * MySQL → Connect : copie l’URL (mysql://root:…@…/railway)
 *
 * PowerShell :
 *   cd backend
 *   $env:MYSQL_URL = "colle_l_url_ici"
 *   npm run import-sql
 */
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

function trimEnv(key) {
  const v = process.env[key];
  if (v == null) return '';
  return String(v).trim();
}

function buildConfig() {
  const urlRaw =
    trimEnv('MYSQL_URL') || trimEnv('DATABASE_URL');
  if (urlRaw && /^mysql:\/\//i.test(urlRaw)) {
    return {
      uri: urlRaw,
      ssl: { rejectUnauthorized: false },
      multipleStatements: true,
    };
  }

  const host =
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

  if (!host || !user) {
    return null;
  }

  return {
    host,
    user,
    password,
    database,
    port,
    ssl: { rejectUnauthorized: false },
    multipleStatements: true,
  };
}

async function main() {
  const cfg = buildConfig();
  if (!cfg) {
    console.error(
      'Définis MYSQL_URL (depuis Connect sur le service MySQL) ou MYSQLHOST + MYSQLUSER + MYSQLPASSWORD + MYSQLDATABASE.'
    );
    process.exit(1);
  }

  const root = path.join(__dirname, '..', '..', 'frontend', 'assets', 'sql');
  const files = ['railway_init.sql', '4images.sql', '1image.sql'];

  let conn;
  try {
    conn = await mysql.createConnection(cfg);

    for (const f of files) {
      const p = path.join(root, f);
      const sql = fs.readFileSync(p, 'utf8');
      console.log('→', f);
      await conn.query(sql);
    }

    const [rows] = await conn.query(
      'SELECT COUNT(*) AS n FROM railway.products'
    );
    console.log('OK — railway.products :', rows[0].n, 'lignes');
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

main();
