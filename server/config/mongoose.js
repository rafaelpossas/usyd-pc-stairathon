/**
 * Created by rafaelpossas on 3/25/15.
 */
var mng = function (address) {
    var mongoose = require('mongoose');
    var User = require('../models/User');
    var Faculty = require('../models/Faculty');

    mongoose.connect(address);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Error connecting to: ' + address));
    db.once('open', function callback() {
        console.log("Connected to " + address);
    });

    User.schema.methods.createDefaultUsers();
    Faculty.schema.methods.createDefaultFaculties();

};
module.exports = mng;

