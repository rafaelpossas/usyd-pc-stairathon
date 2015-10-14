/**
 * Created by rafaelpossas on 7/09/15.
 */
global.config = require('../config/config')["test"];
var chai = require('chai');
var expect = chai.expect;

var superagent = require('superagent');
var jwt = require('jwt-simple');
var User = require('../models/User');
var auth = require('../utilities/auth');

require('../config/mongoose')(global.config.db);

describe('User Authorization', function () {

    it('should let the user authenticate in the webapp with user/password', function (done) {
        superagent
            .post('http://localhost:3000/user/login')
            .send({email: 'rafaelpossas@gmail.com', password: '1'})
            .end(function (err, res) {
                var token = res.body.token;
                expect(token.split('.').length).to.equal(3);
                done();
            })
    });
    it('should let the user logout from the webapp',function(done){
        done();
    });
    it("should deny user to access without being logged", function (done) {
        superagent
            .get("http://localhost:3000/user")
            .end(function (err, res) {
                try {
                    expect(res.status).to.equal(401)
                    done();
                } catch (e) {
                    done(e);
                }

            });
    });
    it("should not let an expired token access the application", function (done) {
        var token = '';
        User.model.findOne({email:'rafaelpossas@gmail.com'},function(err,doc){
            token = auth.createToken(doc,-10);
            superagent
                .get('http://localhost:3000/job')
                .set('Authorization', ('Bearer '+token))
                .end(function(err,res){
                    try{
                        expect(res.status).to.equal(401);
                        expect(res.body.message).to.equal("Your token has expired")
                        done();
                    }catch(e){
                        done(e);
                    }

                });

        })



    })
})