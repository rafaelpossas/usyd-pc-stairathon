var express = require('express');
var router = express.Router();
var users = require('../controllers/users')
var auth = require('../utilities/auth')
var passport = require('passport');
var jobs = require('../controllers/jobs');

router.post('/register',users.createUser);
router.post('/login',passport.authenticate('local-login'),users.loginSuccessful);
router.get('/',auth.isAuthenticated(),function(req,res){
    res.send({status: "ok"});
});

module.exports = router;
