/**
 * Created by rafaelpossas on 3/27/15.
 */
var mongoose = require('mongoose'),
    enc = require('../utilities/encryption');

var UserSchema = mongoose.Schema({
  email: {type:String,required: '{PATH} is required'},
  password: {type:String,required: '{PATH} is required'},
  uniKey: {type:String,required: '{PATH} is required'},
  faculty:{
    id: String,
    name: String
  },
  salt: String,
  token: String
});

UserSchema.methods = {
  createDefaultUsers: function (){
    User.find({}).exec(function(err,collection){
      if(collection.length === 0){
        User.create({email: 'rafaelpossas@gmail.com',password:'1',uniKey: 'rcar7834',faculty:{id:'1',name:"Information Technology"}});
      }
    })
  },
  comparePasswords: function(password){
    if(enc.hashPwd(this.salt,password) === this.password) {return true;}
    else {return false};
  },
  toJSON: function(){
    var user = this.toObject();
    delete user.password;
    delete user.salt;
    return user;
  }
};
UserSchema.pre('save', function (next) {
  var user = this;
  if (!user.isModified('password')) return next();
  else
    user.salt = enc.createSalt();
    user.password = enc.hashPwd(user.salt,user.password);

  next();

});

var User = mongoose.model('User',UserSchema);

module.exports = User;
