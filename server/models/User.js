/**
 * Created by rafaelpossas on 3/27/15.
 */

var User = function () {
    var mongoose = require('mongoose'),
        enc = require('../utilities/encryption');

    var UserSchema = mongoose.Schema({
        email: {type: String, required: '{PATH} is required'},
        password: {type: String, required: '{PATH} is required'},
        uniKey: {type: String, required: '{PATH} is required'},
        rfid: {type: String, require: '{PATH} is required'},
        role: {type: String, enum: ['admin', 'user']},
        faculty: {
            id: String,
            name: String
        },
        salt: String,
        token: String
    });

    UserSchema.methods = {
        createDefaultUsers: function () {
            _model.find({}).exec(function (err, collection) {
                if (collection.length === 0) {
                    _model.create({
                        email: 'rafaelpossas@gmail.com',
                        password: '1',
                        uniKey: 'rcar7834',
                        rfid: "1234",
                        role: 'admin',
                        faculty: {id: '1', name: "Information Technologies"}
                    });
                }
            })
        },
        findByRFID: function (rfid) {
            return _model.find({rfid: rfid}).exec();
        },
        comparePasswords: function (password) {
            if (enc.hashPwd(this.salt, password) === this.password) {
                return true;
            }
            else {
                return false
            }

        },
        toJSON: function () {
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
        user.password = enc.hashPwd(user.salt, user.password);

        if (!user.role || user.role == '')
            user.role = 'user';

        next();

    });

    var _model = mongoose.model('User', UserSchema);

    return {
        model: _model,
        schema: UserSchema
    }

}();


module.exports = User;
