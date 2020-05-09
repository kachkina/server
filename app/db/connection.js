const path = require('path');
const mongoose = require('mongoose');

const dbConnectionString = "mongodb://127.0.0.1:27017/database";
const options = {  useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(dbConnectionString, options);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on('error', error => console.error('MongoDB connection error:', error));

module.exports = { db };