const mongoose = require('mongoose');
const validator = require('validator');
const commSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  yourComment: {
    type: String,
    required: [true, 'you should enter your comment'],
  },
  yourEmail: String,
});

const Comment = mongoose.model('Comment', commSchema);

module.exports = Comment;
