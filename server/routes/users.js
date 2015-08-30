var express = require('express');
var router = express.Router();
var users = require('../controllers/users')
var passport = require('passport');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register',users.createUser);
router.post('/login',passport.authenticate('local-login'),users.loginSuccessful);

module.exports = router;
