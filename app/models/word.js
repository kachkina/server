const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const { Schema } = mongoose;

const wordSchema = new Schema({
  text: { type: String },
  type: { type: String },
});


module.exports = mongoose.model('Words', wordSchema, 'words');
