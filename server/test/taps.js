/**
 * Created by rafaelpossas on 3/09/15.
 */
global.config = require('../config/config')["test"];
var chai = require('chai');
var expect = chai.expect;

var superagent = require('superagent');
var Tap = require('../models/Tap');
var Bracket = require('../models/Bracket');
var mng = require('../config/mongoose.js');

describe('Taps', function () {

    var totalDocuments;

    before(function () {
        totalDocuments = 0;
        mng(global.config.db);
    });
    describe("The database", function () {
        it('should save a tap', function (done) {
            Tap.model.create({
                date: new Date(),
                tapData: {uid: 'rcar7834', faculty: 'Information Technologies', hour: '10', minutes: '10'}
            }, function (err, doc) {
                try {
                    expect(err).to.be.null;
                    expect(doc).to.not.be.undefined;
                    totalDocuments++;
                    done();
                } catch (e) {
                    done(e);
                }

            });

        });
        it('should return a tap by student ID', function () {

        });
        it('should return the tap within a day', function (done) {
            var tap = Tap.schema.methods.findWithinDay(new Date());
            tap.then(function (doc) {
                try{
                    expect(doc.length).to.be.above(0);
                    done();
                }catch (e){
                    done(e);
                }

            }, function (err) {
                done(err);
            })
        });
        it('should remove the tap from the database', function (done) {
            done();
        });
    });

    describe("When the User taps the arduino the web app", function () {
        it('should save the student tap information once', function (done) {
            superagent
                .post('http://localhost:3000/tap')
                .send({id: '1234'})
                .end(function (err, res) {
                    try {
                        expect(res.status).to.equal(200);
                        done();
                    } catch (e) {
                        done(e);
                    }

                });
        });
        it("shouldn' let the student tap twice before 5 min interval", function (done) {
            superagent
                .post('http://localhost:3000/tap')
                .send({id: '1234'})
                .end(function (err, res) {
                    try {
                        superagent
                            .post('http://localhost:3000/tap')
                            .send({id: '1234'})
                            .end(function (err, res) {
                                try {
                                    expect(res.status).to.equal(202);
                                    done();
                                } catch (e) {
                                    done(e);
                                }
                            })
                    } catch (e) {
                        done(e);
                    }

                });
        })
    });
    describe("When the User is accessing the web application", function () {
        it('should return all taps to the user accessing his profile', function (done) {
            superagent
                .get('http://localhost:3000/tap')
                .end(function (err, res) {
                    try{
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.an("Array");
                        expect(res.body.length).to.be.above(0);
                        expect(err).to.be.null;
                        done();
                    }catch (e){
                        done(e);
                    }

                });
        });
    });
    describe("When the tournaments is being run", function () {

        it("should return the first and last day of the month", function () {
            var result = Tap.schema.methods.getMonthStartAndEndDates(1, 2015)
            expect(result[0].getMonth()).to.equal(0);
            expect(result[0].getDate()).to.equal(1);
            expect(result[1].getMonth()).to.equal(0);
            expect(result[1].getDate()).to.equal(31);
        });
        it("should return taps within a month", function (done) {
            var promise = Tap.schema.methods.findTapsByMonth(10, 2015);
            promise
                .then(function (data) {
                    try{
                        expect(data.length).to.equal(5);
                        done();
                    }catch(e){
                        done(e);
                    }

                });
        });
        it("should return the number of taps by faculty", function (done) {
            var promise = Tap.schema.methods.getTapsByFaculty("Information Technologies", 10, 2015);
            promise.then(function (data) {
                try{
                    expect(data).to.be.above(0);
                    done();
                }catch (e){
                    done(e);
                }

            })

        });
        it("should update the bracket with the team results", function (done) {
            var promise = Tap.schema.methods.findTapsByMonth(10, 2015);
            var tapsByMonth;
            var bracket;
            promise
                .then(function (data) {
                    tapsByMonth = data;
                    return Bracket.model.findOne({name:'University of Sydney - Stairathon'}).exec();
                })
                .then(function (data) {
                    bracket = data;
                    Bracket.schema.methods.updateBracketResults(bracket, tapsByMonth);
                    done();
                })
        })
        it("should process a bracket round and create the next stage of the tournament",function(done){
            var promise = Bracket.model.findOne({name:'University of Sydney - Stairathon'}).exec();
            var bracket;
            var tapsByMonth;
            promise.then(function(data){
                bracket = data;
                return Tap.schema.methods.findTapsByMonth(10, 2015);;
            }).then(function(data){
                try{
                    tapsByMonth = data;
                    Bracket.schema.methods.updateBracketResults(bracket, tapsByMonth);
                    Bracket.schema.methods.processRounds(bracket);
                    expect(bracket.faceoff.length).to.equal(3);
                    done();
                }catch(e){
                    done(e);
                }



            })
        })
        it("should find all taps by unikey",function(done){
            var promise = Tap.schema.methods.findByUniKey("rcar7834");
            promise
                .then(function(data){
                    try{
                        expect(data).to.not.be.undefined;
                        done();
                    }catch (e){
                        done(e);
                    }
                });
        })
    })
    after(function (done) {
        done();
    });


})