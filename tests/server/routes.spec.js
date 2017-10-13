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

test('succesful signup', async (done) => {
  request(app)
    .post('/signup')
    .send(user)
    .end(function (err, res) {
      expect(res.status).toEqual(200);
      done();
    });
});

test('unsuccesful signup (duplicate)', async (done) => {
  request(app)
    .post('/signup')
    .send(user)
    .end(function (err, res) {
      expect(res.status).toEqual(401);
      done();
    });
});

test('unsuccesful signup (empty email)', async (done) => {
  request(app)
    .post('/signup')
    .send(Object.assign({}, user, { email: '' }))
    .end(function (err, res) {
      expect(res.status).toEqual(400);
      done();
    });
});

test('succesful login', async (done) => {
  request(app)
    .post('/login')
    .send({ email: user.email, password: user.password })
    .end(function (err, res) {
      expect(res.status).toEqual(200);
      token = res.body.token;
      done();
    });
});

test('unsuccesful login wrong password', async (done) => {
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

test('unsuccesful login (empty password)', async (done) => {
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

test('upload item', async (done) => {
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
