const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const compression = require('compression');
const dotenv = require('dotenv');

dotenv.load();

const app = express();

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'src/public')));
app.set('trust proxy', 1); // trust first proxy

const hour = 3600000; //in seconds * 1000
app.use(session({
  secret: process.env.session,
  resave: false,
  saveUninitialized: true,
  cookie: { path: '/', httpOnly: true, secure: false, maxAge: 60000 },
  store: new RedisStore(),
}));

app.use('/api', require('./router/api'));
app.use('/', require('./router/router'));

const port = process.env.PORT || 3000;

require('./setup')();

if (!module.parent) {
  app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
  });
}

module.exports = app;
