const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const timeout = require('connect-timeout');
const { db } = require('./db/connection');

const routes = require('./routes');

const app = express();
const port = 8001;

process.on('uncaughtException', error => {
  console.error(`${Date.now()}: ${error}`);
  return false;
});

// app.use(`/${process.env.BOOK_PATH_PREFIX}`, express.static(path.join(__dirname, `../${process.env.BOOK_PATH_PREFIX}`)));
app.use(bodyParser.json({ limit: '15mb' }));
app.use(timeout('600s'));

app.use('/api/word', routes);


app.use((error, req, res, next) => {
  if (error && error.message) {
    res.status(error.statusCode || 400).send({ error: true, message: error.message, key: error.key });
  }
});


app.listen(port);

exports = app;
