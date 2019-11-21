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
    username: username,
    email: email,
    token: token,
    salt: salt,
    hash: hash
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

router.post("/user/log_in", async (req, res) => {
  console.log("route log in");
  const { email, password } = req.fields;
  console.log("param recus", email, password);

  const user = await User.findOne({ email: req.fields.email });
  if (user) {
    const hash = SHA256(password + user.salt).toString(encBase64);
    if (user.hash === hash) {
      console.log("user identifié et connecté");
      res.json({
        _id: user._id,
        account: { username: user.username },
        token: user.token
      });
    } else {
      console.log("mot de passe incorrect");
      res.status(401).json({ error: "Mot de passe incorrect" });
    }
  } else {
    console.log("user non trouvé");
    res.status(400).json({ error: "user not found" });
  }
});

module.exports = router;
