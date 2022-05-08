const mongoose = require('mongoose');

const DonateSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true
  },
  books: {
    type: Number,
    required: true
  },
  clothes: {
    type: Number,
    required: true
  },
  stationary: {
    type: Number,
    required: true
  },
  money: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Donate = mongoose.model('Donate', DonateSchema);

module.exports = Donate;
