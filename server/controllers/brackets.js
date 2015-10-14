/**
 * Created by rafaelpossas on 11/10/2015.
 */
/**
 * Created by rafaelpossas on 2/09/15.
 */

var BracketsController = function () {
    var Bracket = require('../models/Bracket');
    var Tap = require('../models/Tap');

    var saveBracket = function (req, res, next) {
        var bracket = req.body.bracket;
        var promise = Bracket.schema.methods.createBracket(bracket.rounds, bracket.name, bracket.teams, bracket.length);
        promise.then(function (doc) {
            res.status(200).send({bracket: doc});
        }, function (error) {
            next(error);
        });
    }
    var getBrackets = function getBrackets(req, res, next) {
        var promise = Bracket.model.find({}).exec();
        promise.then(function (docs) {
            res.status(200).send(docs);
        }, function (error) {
            next(error);
        })
    }
    var getBracket = function getBracket(req, res, next) {
        var faculty = req.query.faculty
        if (faculty) {
            Bracket.schema.methods.findByFaculty(faculty)
                .then(function (docs) {
                    res.status(200).send(docs)
                }, function (err) {
                    res.status(501).send({message: err.stack});
                })
        }

    }
    var getBracketResults = function getBracketResults(req, res, next) {
        var id = req.params.id;
        var bracket;
        Bracket.model.findOne({_id: id})
            .then(function (doc) {
                var date = new Date();
                bracket = doc;
                return Tap.schema.methods.findTapsByMonth(date.getMonth() + 1, date.getFullYear());
            })
            .then(function (tapsByMonth) {
                if (tapsByMonth) {
                    var results = Bracket.schema.methods.updateBracketResults(bracket, tapsByMonth);
                    res.status(200).send(results);
                }else{
                    res.status(200).send([]);
                }
            },function(err){
                res.status(501).send({message: err.stack});
            })
    }
    var removeBracket = function (req, res, next) {
        Bracket.model.findOneAndRemove({_id: req.params.id}, function (err) {
            if (err) next(err);
            res.status(200).send({message: "ok"});
        });
    }
    return {
        saveBracket: saveBracket,
        getBrackets: getBrackets,
        removeBracket: removeBracket,
        getBracket: getBracket,
        getBracketResults: getBracketResults
    }
}();

module.exports = BracketsController;