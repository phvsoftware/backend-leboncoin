const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Ca marche !" });
});

app.listen(4000, () => {
  console.log("serveur leboncoin démarré");
});
