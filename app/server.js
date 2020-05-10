const fs = require('fs');
const express = require('express');
const session = require('express-session');
const redis = require('redis');
const cors = require('cors');
const RedisStore = require('connect-redis')(session);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');

const { db } = require('./db/connection');
const redisPort = 6379;
const redisHost = 'localhost';
let client = null;

const routes = require('./routes');
const auth = require('./routes/auth')

const app = express();
const port = 8001;

process.on('uncaughtException', error => {
  console.error(`${Date.now()}: ${error}`);
  return false;
});

try {
  client = redis.createClient({ host: redisHost, port: redisPort });
} catch (error) {
  console.error(`${Date.now()}: redis error: - ${error.message}`);
}

client.on('error', (err) => {
  console.error(Date.now(), 'Redis connection error:', err.message);
  return false;
});

app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  }
}))

app.use(bodyParser.json({ limit: '15mb' }));
app.use(cookieParser());

app.use(session({
  secret: 'secret',
  name: 'sessionId',
  cookie: {
    secure: false,
    httpOnly: true,
    path: '/',
    maxAge:  30 * 86400,
    sameSite: true,
  },
  store: new RedisStore({ host: redisHost, port: redisPort, client }),
  saveUninitialized: false,
  resave: false,
}));
app.use(timeout('600s'));

app.use('/api/word', routes);
app.use('/api/user', auth);

app.use((error, req, res, next) => {
  if (error && error.message) {
    res.status(error.statusCode || 400).send({ error: true, message: error.message, key: error.key });
  }
});


app.listen(port);

exports = app;
