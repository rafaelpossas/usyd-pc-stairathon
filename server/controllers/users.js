/**
 * Created by rafaelpossas on 3/28/15.
 */

var User = require('../models/User');
//var jwt = require('../services/jwt'); // Use built in jwt implementation
var jwt = require('jwt-simple');


var createToken = function(user,res){
  var payload = {
    sub: user.id
  }
  var token = jwt.encode(payload,"shhh...");

  res.status(200).send({
    user: user.toJSON(),
    token: token
  });
}


var createUser = function(req,res,next){
  var newUser = new User({
    email: req.body.email,
    password: req.body.password
  });
  User.findOne({email:newUser.email},function(err,user) {
    if (err) next(err);

    if (user)
      return res.status(401).send({message: 'Email already exists'});
    else{
      newUser.save(function(err){

        if(err) next(err);

        createToken(newUser,res);

      });
    }
  });

}
var loginSuccessful = function(req,res){
  createToken(req.user,res)
}

exports.loginSuccessful = loginSuccessful;
exports.createUser = createUser;
exports.createToken = createToken;