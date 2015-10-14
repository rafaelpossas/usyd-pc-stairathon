/**
 * Created by rafaelpossas on 16/09/15.
 */
/**
 * Created by rafaelpossas on 3/09/15.
 */
/**
 * Created by rafaelpossas on 3/27/15.
 */

var Bracket = function(){
    var mongoose = require('mongoose');
    var Tap = require('./Tap');
    var Q = require('q');
    var FacultyData =  mongoose.Schema({
        team1:{
            name: {type:String},
            result: {type:Number}
        },
        team2:{
            name: {type:String},
            result: {type:Number}
        },
        round: {type:Number},
        isOver: {type:Boolean,default:false}
    });
    var BracketSchema = mongoose.Schema({
        name: String,
        rounds: {type:Number,enum:[8,4,2,1]},
        faceoff: [FacultyData],
        length: String
    });

    BracketSchema.methods = {
        findByDate: function(date){
            return _model.find({month: date.getMonth()+1,year:date.getFullYear()}).exec();
        },
        findByMonthAndYear: function(month,year){
          return _model.find({month: month,year:year}).exec();
        },
        createBracket: function(rnd,name,teams,length){
            var deferred = Q.defer();
            var faceoff = [];
            var match = [];
            if(rnd > (teams.length/2))
                throw new Error("Not enough teams to create a bracket");
            teams.forEach(function(team){
                match.push(team);
                if(match.length === 2){
                    if(match.length === 2){
                        faceoff.push(BracketSchema.methods.createMatch(match[0].name,match[1].name,rnd));
                        match = [];
                    }
                }
            })
            _model.create({name: name,rounds:rnd,faceoff:faceoff,length: length},function(err,doc){
                if(err) deferred.reject(err)
                deferred.resolve(doc);
            });
            return deferred.promise;
        },
        findByFaculty: function(facultyName){
            return _model.find({$or:[{"faceoff.team1.name": facultyName},{"faceoff.team2.name":facultyName}]}).exec();
        },
        updateBracketResults: function(bracket,tapsByMonth){
            bracket.faceoff.forEach(function(duel){
                if(!duel.isOver){
                    duel.team1.result = Tap.schema.methods.getTapsByFaculty(duel.team1.name,tapsByMonth);
                    duel.team2.result = Tap.schema.methods.getTapsByFaculty(duel.team2.name,tapsByMonth);
                }
            });
            return bracket;
        },
        createMatch: function(team1Name,team2name,round){
            var match = {
                round: round,
                isOver: false,
                team1: {
                    name: team1Name,
                        result: 0
                },
                team2: {
                    name: team2name,
                        result: 0
                }

            };
            return match;

        },
        processRounds: function(bracket){
            var match = [];
            bracket.faceoff.forEach(function(duel){
                if(duel.round === bracket.rounds){
                    if (duel.team1.result > duel.team2.result){
                        match.push(duel.team1);
                        duel.isOver = true;
                    }else{
                        match.push(duel.team2);
                        duel.isOver = true;
                    }
                    if(match.length === 2){
                        bracket.faceoff.push(BracketSchema.methods.createMatch(match[0].name,match[1].name,bracket.round/2));
                        match = [];
                    }
                }
            })
            bracket.round/=2;
            return bracket;
        }
    };
/*
    BracketSchema.pre('save', function (next) {
        var bracket = this;
        if(bracket.faceoff.length !== (bracket.round/2)){
            var err = new Error("Not enough teams");
            next(err);

        }else{
            next();
        }

    });
*/

    var _model = mongoose.model('Bracket',BracketSchema);

    return{
        model: _model,
        schema: BracketSchema
    }
}();


module.exports = Bracket;
