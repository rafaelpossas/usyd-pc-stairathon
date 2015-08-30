/**
 * Created by rafaelpossas on 4/29/15.
 */
var jwt = require('jwt-simple');

exports.isAuthenticated = function(){
  return function(req,res,next){
    if(!req.headers.authorization){
       res.status(401).send({message: 'You are not authorized'});
       res.end();
    }
    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token,"shhh...");

    if(!payload.sub){
      res.status(401).send({message:'You are not authorized'});
      res.end();
    }else{
      next();
    }


  }
}