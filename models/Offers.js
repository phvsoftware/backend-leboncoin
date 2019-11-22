const mongoose = require("mongoose");

const Offers = mongoose.model("Offers", {
  pictures: [],
  title: String,
  description: String,
  price: Number,
  creator: {
    account: {
      username: String
    },
    _id: String
  },
  created: String
});

module.exports = Offers;
