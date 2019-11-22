const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;

const Offers = require("../models/Offers");
const User = require("../models/User");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post("/publish", async (req, res) => {
  // on lit le header authorization
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401).json({
      error: "Missing Authorization Header"
    });
    return;
  }
  // on extrait le token et on vérifie que c'est bien un Bearer
  const parts = req.headers.authorization.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({
      error: "Invalid Authorization Header"
    });
    return;
  }
  const token = parts[1];
  // on cherche l'utilisateur associé a ce token
  const user = await User.findOne({ token: token });
  if (!user) {
    res.status(401).json({
      error: "Invalid Token"
    });
    return;
  }
  // si on a trouvé l'utilisateur on peut ajouter une annonce
  const { title, description, price } = req.fields;
  const userId = user._id;

  // upload de l'image
  try {
    cloudinary.uploader.upload(req.files.files.path, async function(
      error,
      result
    ) {
      console.log("publish 5.5");
      if (!error) {
        const url = result.secure_url;
        // sauvegarde dans la base
        const created = new Date().toJSON();
        const offer = new Offers({
          title,
          description,
          price,
          created,
          url,
          userId
        });
        await offer.save();

        // message de retour
        res.json({
          _id: offer._id,
          title: offer.title,
          description: offer.description,
          price: offer.price,
          created: offer.created,
          pictures: [url],
          token: user.token,
          account: {
            username: user.username
          }
        });
      } else {
        res.status(400).json({ message: "An error occurred" });
      }
    });
  } catch (e) {
    res.status(400).json({ message: "An error occurred" });
  }
});

module.exports = router;
