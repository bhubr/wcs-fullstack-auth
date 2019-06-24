const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local');
// Importe dotenv et la configuration stockée dans .env
// Doit IMPERATIVEMENT être importé avant la mise en place
// de la connexion à la BDD dans db.js
require('./env');
const authRouter = require('./routes/auth');
const db = require('./db');

// Initialisation Express et bodyParser
const app = express();
app.use(bodyParser.json());

// Initialisation Passport
app.use(passport.initialize());

// Fonctions de "sérialisation" et "dé-sérialisation"
// Nécessaire UNIQUEMENT pour l'auth par session
// passport.serializeUser(function(user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function(user, done) {
//   done(null, user);
// });

// Initialisation de la LocalStrategy
passport.use(new LocalStrategy(
  // 1er paramètre: options pour la stratégie locale
  {
    // indique à passport où trouver les champs sur req.body
    usernameField: 'email',
    passwordField: 'password',
    // ce paramètre est probablement ignoré
    session: false
  },
  // 2ème paramètre: une fonction qui reçoit le username (email) et password
  // extraits du body, et un dernier paramètre "done", qui est un callback
  // à appeler quand on a soit échoué, soit réussi à identifier l'user
  (username, password, done) => {
    // Récupération d'un utilisateur
    db.query('SELECT * FROM user WHERE email = ?', username, (err, users) => {
      // Si une erreur se produit, appel du callback en erreur (1er et seul paramètre)
      if (err) { return done(err); }
      // Pas d'erreur mais tableau vide = pas d'utilisateur trouvé
      // On appelle le callback sans erreur, mais avec false
      // comme 2nd argument pour indiquer un échec
      if (users.length === 0) { return done(null, false); }
      // Pas d'erreur, tableau non vide = on a trouvé l'user
      // Il est à l'index 0 dans le tableau récupéré de la BDD
      const user = users[0];
      // bcrypt.compare: 1er argument = password envoyé au signin
      // 2ème argument = hash stocké dans la table user
      // dans le .then la fonction récupère une valeur match
      // indiquant si les deux mdp correspondent
      bcrypt.compare(password, user.password)
       .then(function(match) {
          // échec si le password envoyé ne match pas le hash
          if (!match) { return done(null, false); }

          // récupération des données du user SANS le password
          const { id, email, fullname } = user;
          // appel du callback en passant les data en 2ème argument
          return done(null, { id, email, fullname });
        });
    });
  }
));

app.use('/api/auth', authRouter);

app.listen(process.env.PORT || 5000);