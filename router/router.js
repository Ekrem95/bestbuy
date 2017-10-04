const r = require('express').Router();
const path = require('path');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
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

r.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/public', 'index.html'));
});

r.post('/login', (req, res) => {
  if (req.body.email.length < 5 || req.body.password.length < 6) {
    res.status(400).json({ msg: 'Bad Request' });
    return;
  }

  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query(
      'SELECT name, password FROM users WHERE email = $1 limit 1',
      [req.body.email], (err, rows) => {
      done();

      if (err) {
        console.log(err.stack);
        return;
      }

      if (rows.rowCount === 0) {
        res.status(401).json({ msg: 'User with this email address does not exists.' });
        return;
      }

      const hash = rows.rows[0].password;
      const match = bcrypt.compareSync(req.body.password, hash);

      if (match === false) {
        res.status(401).json({ msg: 'Wrong email & password combination.' });
        return;
      }

      const token = jwt.sign({
        name: rows.rows[0].name,
      }, process.env.token, { expiresIn: 60 * 60 * 24 });

      res.status(200).json({
        token: token,
      });
    });
  });
});

r.post('/signup', (req, res) => {
  if (req.body.name.length < 1 ||
      req.body.email.length < 5 ||
      req.body.password.length < 6) {
    res.status(400).json({ msg: 'Bad Request' });
    return;
  }

  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query(
      'SELECT FROM users WHERE email = $1 limit 1', [req.body.email], (err, rows) => {
      if (err) {
        done();
        console.log(err.stack);
        res.status(500).json({ msg: 'Internal Server Error.' });
        return;
      }

      // console.log(rows);
      if (rows.rowCount !== 0) {
        done();
        res.status(401).json({ msg: 'User with same email address already exists.' });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      delete req.body.password;

      client.query(
        'insert into users (name, email, password) values ($1, $2, $3)',
        [req.body.name, req.body.email, hash], (err, rows) => {
        done();
        if (err) {
          console.log(err.stack);
          res.status(500).json({ msg: 'Internal Server Error.' });
          return;
        }

        const token = jwt.sign({
          name: rows.rows[0].name,
        }, process.env.token, { expiresIn: 60 * 60 * 24 });

        res.status(200).json({
          token: token,
        });
      });

    });
  });
});

module.exports = r;
