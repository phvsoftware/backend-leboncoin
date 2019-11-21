const mongoose = require("mongoose");

const Offers = mongoose.model("Offers", {
  title: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true
  },
  description: {
    type: String,
    minlength: 3,
    maxlength: 254,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  created: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

module.exports = Offers;
