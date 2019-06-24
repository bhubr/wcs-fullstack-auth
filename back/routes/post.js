const express = require('express');
const passport = require('passport');
const db = require('../db');

const router = express.Router();

router.get('/',
passport.authenticate('jwt', { session:  false }),
(req, res) => {
  console.log(req.user);
  res.json([
    { id: 1, title: 'An article' }
  ]);
});

module.exports = router;