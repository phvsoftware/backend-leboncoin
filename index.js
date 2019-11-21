require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const formidableMiddleware = require("express-formidable");

const app = express();
app.use(formidableMiddleware());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

require("./models/User");

const userRoutes = require("./routes/user");

app.use(userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Ca marche !" });
});

app.listen(process.env.PORT, () => {
  console.log("serveur leboncoin démarré");
});
