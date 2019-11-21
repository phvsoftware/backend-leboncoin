const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const cloudinary = require("cloudinary").v2;

const Offers = require("../models/Offers");
const User = require("../models/User");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.post("/publish", async (req, res) => {
  console.log("publish 1");
  // on lit le header authorization
  const auth = req.headers.authorization;
  if (!auth) {
    res.status(401).json({
      error: "Missing Authorization Header"
    });
    return;
  }
  console.log("publish 2");
  // on extrait le token et on vérifie que c'est bien un Bearer
  const parts = req.headers.authorization.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({
      error: "Invalid Authorization Header"
    });
    return;
  }
  const token = parts[1];
  console.log("publish 3", token);
  // on cherche l'utilisateur associé a ce token
  const user = await User.findOne({ token: token });
  if (!user) {
    res.status(401).json({
      error: "Invalid Token"
    });
    return;
  }
  console.log("publish 4");
  // si on a trouvé l'utilisateur on peut ajouter une annonce
  const { title, description, price } = req.fields;
  const userId = user._id;

  // upload de l'image

  try {
    console.log("publish 5");
    cloudinary.uploader.upload(req.files.files.path, async function(
      error,
      result
    ) {
      console.log("publish 5.5");
      if (!error) {
        const url = result.secure_url;
        console.log("publish 6", url);
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

        console.log("publish 7");

        await offer.save();

        console.log("publish 8");

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
        console.log("publish 9", {
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
        console.log("upload error", error);
        res.status(400).json({ message: "An error occurred" });
      }
    });
  } catch (e) {
    res.status(400).json({ message: "An error occurred" });
  }
});

module.exports = router;
