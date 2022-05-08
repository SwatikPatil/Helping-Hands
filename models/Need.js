const mongoose = require('mongoose');

const NeedSchema = new mongoose.Schema({
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

const Need = mongoose.model('Need', NeedSchema);

module.exports = Need;
