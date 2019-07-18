const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const db = require('../db');

const saltRounds = 10;

const router = express.Router();

// Inscription d'un nouvel utilisateur
router.post('/signup', (req, res) => {
  // Récupération des données dans le body
  const { email, password, fullname } = req.body;
  // Le fullname n'est pas obligatoire, mais si on ne
  // trouve pas d'email ou pas de password, on renvoie
  // une erreur (code 400 = Bad Request)
  if (!email || !password) {
    return res.status(400).json({
      error: 'required field(s) missing'
    });
  }
  if (password.length < 8) {
    return res.status(400).json({
      error: 'password is too short'
    });
  }
  // Si on a bien un password, on l'encrypte avec bcrypt.hash
  // Le paramètre saltRounds est un nombre d'itérations pour générer
  // un "salt", chaîne aléatoire accolée au password pour empêcher le
  // passage en "brute force".
  bcrypt.hash(password, saltRounds)
    .then(hash => {
        // Une fois le hash créé, on va créer l'utilisateur dans
        // la table user (on passe un objet)
        db.query(
          'INSERT INTO user SET ?',
          [{ email, password: hash, fullname }],
          (err, status) => {
            if (err) {
              return res.sendStatus(500);
            }
            return res.status(201).json({
              status: 'user created'
            });
        });
    });
});

router.post('/signin',
  passport.authenticate('local', { session:  false }),
  (req, res) => {
    jwt.sign(req.user, process.env.SECRET_KEY, (err, token) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }
      // Idéalement c'est ici qu'on génèrerait le JWT,
      // plutôt que de renvoyer l'user !!
      return res.json({
        token
      });
    });
  }
);

router.post
module.exports = router;
