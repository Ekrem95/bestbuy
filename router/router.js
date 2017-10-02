const r = require('express').Router();
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.dbname,
  host: 'localhost',
  database: process.env.dbname,
  password: process.env.pgpass,
  port: 5432,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

r.get('/eko', (req, res) => {
  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query('SELECT * FROM playground WHERE type != $1', [1], (err, res) => {
      done();

      if (err) {
        console.log(err.stack);
      } else {
        console.log(res.rows[0]);
      }
    });
  });

  res.sendFile(path.join(__dirname, '../src/public', 'index.html'));
});

r.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/public', 'index.html'));
});

module.exports = r;
