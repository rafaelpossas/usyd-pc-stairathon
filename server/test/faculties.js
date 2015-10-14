global.config = require('../config/config')["test"];
var chai = require('chai');
var expect = chai.expect;
var superagent = require('superagent');

require('../config/mongoose.js')(global.config.db);


describe('Faculties', function () {

    var totalDocuments;
    var Faculty = require('../models/Faculty')

    before(function () {
        totalDocuments = 0;
    });
    describe("The Database",function(){
        it('should let the developer save a faculty',function(done){
            var promise = Faculty.schema.methods.saveFaculty('Social Sciences');
            promise.then(function(doc){
                try{
                    expect(doc).to.not.be.undefined;
                }catch (e){
                    done(e)
                }
                done();
            },function(err){
                done(err);
            });
        });
        it('should let the developer get all faculties',function(done){
            var promise = Faculty.schema.methods.findAll();
            promise.then(function(col){
                try{
                    expect(col.length).to.be.above(0);
                    done();
                }catch(e){
                    done(e);
                }
            },function(err){
                done(err);
            })

        });
        it('should let the developer find faculties by name',function(done){
            Faculty.schema.methods.findByName("Social Sciences",function(doc){
                try{
                    expect(doc.length).to.be.above(0);
                    done();
                }catch(e){
                    done(e);
                }
            },function(err){
                done(err);
            });

        });
    });
    describe('The web app',function(done){
        it('should allow admin user to save a faculty',function(done){
            superagent
                .post('http://localhost:3000/faculty')
                .send({name:'Law'})
                .end(function(err,res){
                    done();
                })

        });
    })

    after(function (done) {
        Faculty.model.remove({},function(err){
            if(err) done(err);
            done();
        });
    });


})