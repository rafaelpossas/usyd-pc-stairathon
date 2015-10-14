/**
 * Created by rafaelpossas on 16/09/15.
 */
global.config = require('../config/config')["test"];
var chai = require('chai');
var expect = chai.expect;
var superagent = require('superagent');
var Bracket = require("../models/Bracket")
require('../config/mongoose.js')(global.config.db);

describe('Bracket', function () {

    var totalDocuments;

    before(function () {
        totalDocuments = 0;
    });

    describe("The database", function () {
        it('should not let a bracket being saved if the number of teams are not equals to round/2', function (done) {
            var teams = [
                {
                    name: "Information Technologies"
                },
                {
                    name: "Law"
                },
                {
                    name: "Engineering"
                },
                {
                    name: "Health Sciences"
                }
            ]
            Bracket.schema.methods.createBracket(2,'University of Sydney - Stairathon',teams)
                .then(function(data){
                    console.log(data);
                })
        });
        it.only('should find brackets by faculty',function(done){
            Bracket.schema.methods.findByFaculty("Information Technologies")
                .then(function(doc){
                    try{
                        expect(doc).to.not.be.undefined;
                        done();
                    } catch (e) {
                        done(e);
                    }

                },function(err){
                   done(err);
                });
        })
    });

    after(function () {

    });


})