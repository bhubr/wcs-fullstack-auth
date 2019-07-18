const express = require('express');
const passport = require('passport');
const db = require('../db');

const router = express.Router();

router.put('/:id',
passport.authenticate('jwt', { session:  false }),
(req, res, next) => {
  const updateUserId = Number(req.params.id);
  if (updateUserId !== req.user.id) {
    return res.status(403).json({
      error: 'This profile is not yours!!'
    })
  }
  next();
},
(req, res) => {
  console.log(req.user);
  res.sendStatus(200);
})

module.exports = router;
