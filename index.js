require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");
// const cloudinary = require("cloudinary").v2;

const app = express();
app.use(formidableMiddleware());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

require("./models/User");
require("./models/Offers");

const userRoutes = require("./routes/user");
app.use(userRoutes);
const offerRoutes = require("./routes/offers");
app.use(offerRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Ca marche !" });
});

app.listen(process.env.PORT, () => {
  console.log("serveur leboncoin démarré");
});
