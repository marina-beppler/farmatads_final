const { Pool } = require('pg');
require('dotenv').config();

const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbDatabase = process.env.DB_DATABASE;
const dbPassword = process.env.DB_PASSWORD;
const dbPort = process.env.DB_PORT;

console.log('DB_USER:', dbUser);
console.log('DB_HOST:', dbHost);
console.log('DB_DATABASE:', dbDatabase);
console.log('DB_PASSWORD:', dbPassword ? 'Loaded' : 'Not Loaded');
console.log('DB_PORT:', dbPort);

if (!dbUser || !dbHost || !dbDatabase || !dbPassword || !dbPort) {
  console.error('One or more environment variables are not set.');
  process.exit(1);
}

const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbDatabase,
  password: dbPassword,
  port: parseInt(dbPort, 10),
  ssl: false,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log(result.rows);
  });
});

module.exports = pool;
