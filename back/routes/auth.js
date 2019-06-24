const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../db');

const saltRounds = 10;

const router = express.Router();

router.post('/signup', (req, res) => {
  const { email, password, fullname } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: 'required field(s) missing'
    });
  }
  bcrypt.hash(password, saltRounds)
    .then(hash => {
        db.query(
          'INSERT INTO user SET ?',
          [{ email, password: hash, fullname }],
          (err, status) => {
            return res.status(201).json({
              status: 'user created'
            });
        });
    });
});

router.post('/signin', (req, res) => {

});

router.post
module.exports = router;
