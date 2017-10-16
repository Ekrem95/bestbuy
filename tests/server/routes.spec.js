const app = require('../../server');
const jwt = require('jsonwebtoken');
const request = require('supertest');

const pool = require('../../router/router').db;
const clear = require('../setup/clear-db');
const { user, item } = require('../setup/static');

let token;

beforeAll(() => {
  clear();
});

beforeEach(() => {

});

test('sends html', () => {
  request(app)
    .get('/')
    .expect('Content-Type', /html/)
    .expect('Content-Length', '324')
    .expect(200)
    .end(function (err, res) {
      if (err) throw err;
    });
});

test('check auth endpoint without token', () => {
  request(app)
    .get('/api/auth')
    .expect('Content-Type', /json/)
    .expect('Content-Length', '16')
    .expect(401)
    .end(function (err, res) {
      if (err) throw err;
    });
});

test('check auth endpoint with token', () => {
  const token = jwt.sign({
    id: Math.random(),
  }, process.env.token, { expiresIn: 60 * 60 * 24 });

  request(app)
    .get('/api/auth')
    .set('Authorization', token)
    .expect('Content-Type', /json/)
    .expect('Content-Length', '15')
    .expect(200)
    .end(function (err, res) {
      if (err) throw err;
    });
});

test('logout', () => {
  request(app)
    .post('/logout')
    .expect(200)
    .end(function (err, res) {
      if (err) throw err;
    });
});

test('succesful signup', (done) => {
  request(app)
    .post('/signup')
    .send(user)
    .end(function (err, res) {
      expect(res.status).toEqual(200);
      done();
    });
});

test('unsuccesful signup (duplicate)', (done) => {
  request(app)
    .post('/signup')
    .send(user)
    .end(function (err, res) {
      expect(res.status).toEqual(401);
      done();
    });
});

test('unsuccesful signup (empty email)', (done) => {
  request(app)
    .post('/signup')
    .send(Object.assign({}, user, { email: '' }))
    .end(function (err, res) {
      expect(res.status).toEqual(400);
      done();
    });
});

test('succesful login', (done) => {
  request(app)
    .post('/login')
    .send({ email: user.email, password: user.password })
    .end(function (err, res) {
      expect(res.status).toEqual(200);
      token = res.body.token;
      done();
    });
});

test('unsuccesful login wrong password', (done) => {
  request(app)
    .post('/login')
    .send({
      email: user.email,
      password: user.password.split('').reverse().join(''),
    })
    .end(function (err, res) {
      expect(res.status).toEqual(401);
      done();
    });
});

test('unsuccesful login (empty password)', (done) => {
  request(app)
    .post('/login')
    .send({
      email: user.email,
      password: '',
    })
    .end(function (err, res) {
      expect(res.status).toEqual(400);
      done();
    });
});

test('upload item', (done) => {
  request(app)
    .post('/upload-item')
    .send(item)
    .set('Authorization', token)
    .expect(200)
    .end(function (err, res) {
      // expect(res.status).toEqual(400);
      if (err) throw err;
      done();
    });
});

test('upload item with empty field (name)', (done) => {
  request(app)
    .post('/upload-item')
    .send(Object.assign({}, item, { name: '' }))
    .set('Authorization', token)
    .expect(400)
    .end(function (err, res) {
      // expect(res.status).toEqual(400);
      if (err) throw err;
      done();
    });
});

test('buy product', (fin) => {
  pool.connect((err, client, done) => {
      if (err) throw err;
      client.query(
        'select id from items where name = $1',
        [item.name], (err, rows) => {
        if (err) {
          done();
          console.log(err.stack);
          return;
        }

        const itemID = rows.rows[0].id;

        request(app)
          .post('/buy-product')
          .send({ id: itemID })
          .set('Authorization', token)
          .expect(200)
          .end(function (err, res) {
            // expect(res.status).toEqual(400);
            if (err) throw err;

            client.query(
              'delete from transactions where item_id = $1',
              [itemID], (err, rows) => {
                done();
                if (err) {
                  console.log(err.stack);
                  return;
                }
              });
          });
      });
    });

  fin();
});
