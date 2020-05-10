const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const { Schema } = mongoose;

const wordSchema = new Schema({
  text: { type: String },
  type: { type: String, enum: ['entered', 'dictionary'] },
  user: { type:Schema.Types.ObjectId, ref: 'User' },
});


module.exports = mongoose.model('Word', wordSchema, 'words');
