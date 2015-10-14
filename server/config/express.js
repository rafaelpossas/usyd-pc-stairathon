/**
 * Created by rafaelpossas on 3/25/15.
 */

var express = function () {

    var cookieParser = require('cookie-parser');
    var bodyParser = require('body-parser');
    var path = require('path');
    var express = require('express');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var User = require('../models/User');

    var app = express();


    // uncomment after placing your favicon in /public
    //app.use(favicon(__dirname + '/public/favicon.ico'));
    if (global.env !== "test")
        app.use(global.logger('dev'));

    app.use(bodyParser.json());
    app.use(passport.initialize());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        next();
    });
    var strategyOptions = {usernameField: 'email'};


    var loginStrategy = new LocalStrategy(strategyOptions, function (email, password, done) {
        User.model.findOne({email: email}, function (err, user) {
            if (err) done(err);

            if (!user)
                return done(null, false, {message: 'Wrong email/password'});
            if (user.comparePasswords(password)) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Wrong password'});
            }
        })
    });

    passport.use('local-login', loginStrategy);

    var users = require(global.config.rootPath + 'server/routes/users');
    var jobs = require(global.config.rootPath + 'server/routes/jobs');
    var faculties = require(global.config.rootPath + 'server/routes/faculties');
    var taps = require(global.config.rootPath + 'server/routes/taps');
    var brackets = require(global.config.rootPath + 'server/routes/brackets');

    app.use('/user', users);
    app.use('/faculty', faculties);
    app.use('/tap', taps);
    app.use('/bracket', brackets);

    if (global.config.name == 'prod') {
        app.use(express.static(global.config.rootPath + '/public/'));
    }

    return app

}();

module.exports = express;