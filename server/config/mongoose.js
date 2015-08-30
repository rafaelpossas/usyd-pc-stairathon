/**
 * Created by rafaelpossas on 3/25/15.
 */
var mongoose = require('mongoose');

var User = require('../models/User');

module.exports = function(){
  mongoose.connect(global.config.db);
  var db = mongoose.connection;
  db.on('error',console.error.bind(console,'connection error....'));
  db.once('open',function callback() {
    console.log('usydhealth-db opened!!');
  });

  User.schema.methods.createDefaultUsers();

}

