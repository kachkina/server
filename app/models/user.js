const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String },
  password: { type: Buffer },
});


module.exports = mongoose.model('User', userSchema, 'users');
