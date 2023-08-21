const express = require('express');
const router = express.Router();

router.get('/user-signup', (req, res) => {
  return res.render('signupUser');
});

module.exports = router;
