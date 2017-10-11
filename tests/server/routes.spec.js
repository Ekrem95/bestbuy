const request = require('supertest');
const app = require('../../server');
const jwt = require('jsonwebtoken');

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

// test('succesful signup', () => {
//   request(app)
//     .post('/signup')
//     // .send({ name: 'testuser' })
//
//     // .expect('Content-Type', /json/)
//     // .expect('Content-Length', '16')
//     // .expect(200)
//     .end(function (err, res) {
//       console.log(res.body, res.statusCode);
//       if (err) throw err;
//     });
// });
