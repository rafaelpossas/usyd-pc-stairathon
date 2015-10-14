/**
 * Created by rafaelpossas on 4/29/15.
 */
var jwt = require('jwt-simple');
exports.createToken = function (user, expires) {
    var currentDate = new Date();
    var expiredDate;
    if (!expires) {
        expiredDate = new Date(currentDate.getTime()+(60*60000)); // Default is one hour
    }else{
        expiredDate = new Date(currentDate.getTime()+(expires*60000));
    }

    var payload = {
        sub: user.id,
        expires: expiredDate.getTime()
    }
    var token = jwt.encode(payload, "shhh...");
    return token;
}


exports.isAuthenticated = function () {
    return function (req, res, next) {
        if (!req.headers.authorization) {
            res.status(401).send({message: 'You are not authorized'});
            res.end();
        } else {
            var token = req.headers.authorization.split(' ')[1];
            var payload = jwt.decode(token, "shhh...");
            if (!payload.sub) {
                res.status(401).send({message: 'You are not authorized'});
                res.end();
            } else if (payload.expires <= Date.now()) {
                res.status(401).send({message: 'Your token has expired'});
                res.end();
            } else {
                next();
            }
        }


    }
}