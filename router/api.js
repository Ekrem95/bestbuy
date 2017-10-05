const r = require('express').Router();
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

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

r.get('/auth', (req, res) => {
  const token = req.get('Authorization');
  jwt.verify(token, process.env.token, function (err, decoded) {
    if (decoded === undefined) {
      res.json({ access: false });
      return;
    }

    res.json({ access: true });
  });
});

r.get('/myproducts', (req, res) => {
  const token = req.get('Authorization');
  jwt.verify(token, process.env.token, function (err, decoded) {
      if (decoded === undefined) {
        res.status(401).json({ msg: 'You are not authorized.' });
        return;
      }

      const { name, price, quantity, tags, src } = req.body;

      pool.connect((err, client, done) => {
        if (err) throw err;
        client.query(`
          select i.name, i.price, i.id, a.src
          from items i, item_attributes a
          where (i.owner_id = $1 and a.item_id = i.id)
          `,
           [decoded.id], (err, rows) => {
            done();
            if (err) {
              console.log(err.stack);
              res.status(500).json({ msg: 'Internal Server Error.' });
              return;
            }

            res.status(200).json({ items: rows.rows });
          });
      });
    });
});

module.exports = r;
