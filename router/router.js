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

r.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send('User-agent: *\nDisallow: /');
  });

r.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/public', 'index.html'));
});

r.post('/logout', (req, res) => {
  req.session.destroy();
  res.status(200).send();
});

r.post('/login', (req, res) => {
  if (req.body.email.length < 5 || req.body.password.length < 6) {
    res.status(400).json({ msg: 'Bad Request' });
    return;
  }

  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query(
      'SELECT id, password FROM users WHERE email = $1 limit 1',
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
        id: rows.rows[0].id,
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

      if (rows.rowCount !== 0) {
        done();
        res.status(401).json({ msg: 'User with same email address already exists.' });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);
      delete req.body.password;

      client.query(
        'insert into users (name, email, password) values ($1, $2, $3) returning id',
        [req.body.name, req.body.email, hash], (err, rows) => {
        done();
        if (err) {
          console.log(err.stack);
          res.status(500).json({ msg: 'Internal Server Error.' });
          return;
        }

        const token = jwt.sign({
          id: rows.rows[0].id,
        }, process.env.token, { expiresIn: 60 * 60 * 24 });

        res.status(200).json({
          token: token,
        });
      });

    });
  });
});

r.post('/upload-item', (req, res) => {
  const token = req.get('Authorization');
  jwt.verify(token, process.env.token, function (err, decoded) {
    if (decoded === undefined) {
      res.status(401).json({ msg: 'You are not authorized.' });
      return;
    }

    const { name, price, quantity, tags, src } = req.body;

    pool.connect((err, client, done) => {
      if (err) throw err;
      client.query(
        `insert into items (name, price, quantity, owner_id)
         values ($1, $2, $3, $4) returning id`,
         [name, price, quantity, decoded.id], (err, rows) => {
        if (err) {
          done();
          console.log(err.stack);
          res.status(500).json({ msg: 'Internal Server Error.' });
          return;
        }

        const itemID = rows.rows[0].id;

        client.query(
          `insert into item_attributes (src, item_id, tags)
           values ($1, $2, $3)`,
           [src, itemID, tags], (err, rows) => {
            done();
            if (err) {
              console.log(err.stack);
              res.status(500).json({ msg: 'Internal Server Error.' });
              return;
            }

            res.status(200).send();
          });
      });
    });
  });
});

module.exports = r;
