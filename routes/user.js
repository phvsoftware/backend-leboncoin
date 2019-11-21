const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

router.post("/user/sign_up", async (req, res) => {
  console.log("route signup");
  const { email, username, password } = req.fields;
  console.log("param recus", email, username, password);
  // on crée un token
  const token = uid2(16);
  // on crée un salt
  const salt = uid2(16);
  // on génère le hash (SHA256 est un autre algorithme de hash)
  const hash = SHA256(password + salt).toString(encBase64);
  // on sauvegarde en bdd username, token, salt et hash mais pas password !
  const user = new User({
    username,
    token,
    salt,
    hash
  });
  console.log("user créé", user);
  await user.save();
  res.json({
    _id: user._id,
    token: user.token,
    account: {
      username: user.username
    }
  });
});

module.exports = router;
