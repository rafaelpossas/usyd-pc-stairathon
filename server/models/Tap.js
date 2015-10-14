/**
 * Created by rafaelpossas on 3/09/15.
 */
/**
 * Created by rafaelpossas on 3/27/15.
 */

var Tap = function () {
    var mongoose = require('mongoose');
    var Q = require('q');
    var TapData = mongoose.Schema({
        uid: {type: String},
        faculty: {type: String},
        hour: {type: Number, min: 1, max: 24},
        minutes: {type: Number, min: 0, max: 60}
    });

    var TapSchema = mongoose.Schema({
        date: {type: Date, required: '{PATH} is required'},
        tapData: [TapData]
    });

    TapSchema.methods = {
        findWithinDay: function (date) {
            var nextday = new Date();
            nextday.setDate(date.getDate() + 1)
            return _model.find({date: {$gte: date}, date: {$lt: nextday}}).exec();
        },
        createTap: function () {
            var defer = Q.defer();
            _model.create({date: new Date(), tapData: []}, function (err, doc) {
                if (err) defer.reject(err);
                else defer.resolve(doc);
            });
            return defer.promise;
        },
        findByUniKey: function (uid) {
            var result = [];
            var deferred = Q.defer();
            _model.find({"tapData.uid": uid}, {tapData: 1,date:1}).exec()
                .then(function (taps) {
                    for(var j = (taps.length-1);j >= 0;j--){
                        var tap = taps[j];
                        var date = tap.date;
                        for( var i = (tap.tapData.length -1); i >= 0;i--){
                            if(result.length < 5){
                                var data = tap.tapData[i];
                                if (data && data.uid === uid) {
                                    result.push({
                                        faculty: data.faculty,
                                        hour: data.hour,
                                        minutes: data.minutes,
                                        date:  date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()
                                    });
                                }
                            }
                        }
                    }
                    deferred.resolve(result);
                }, function (err) {
                    deferred.reject(err)
                });
            return deferred.promise;
        },
        getMonthStartAndEndDates: function (month, year) {
            var result = [];
            result.push(new Date(year, month - 1, 1));
            result.push(new Date(year, month, 0));
            return result;
        },
        findTapsByMonth: function (month, year) {
            var dates = this.getMonthStartAndEndDates(month, year);
            return _model.find({date: {$gte: dates[0]}, date: {$lte: dates[1]}}).exec();
        },
        getTapsByFaculty: function (faculty, tapsByMonth) {
            var numTaps = 0;
            tapsByMonth.forEach(function (day) {
                day.tapData.forEach(function (tap) {
                    if (tap.faculty === faculty) {
                        numTaps++;
                    }
                })
            });
            return numTaps;
        }
    };
    /*    TapSchema.pre('save', function (next) {
     try{
     Bracket.schema.methods.findByDate(this.date)
     .then(function(bracket){
     try{
     if(bracket && bracket.length > 0){
     bracket.faceoff.forEach(function(data){
     if(data.team_1 === this.faculty ){
     data.results.team_1++;
     }
     })
     }
     next();
     } catch (e){
     next(e);
     }

     },function(err){
     next(err);
     });
     }catch (e){
     next(e);
     }

     });*/
    var _model = mongoose.model('Tap', TapSchema);

    return {
        model: _model,
        schema: TapSchema
    }
}();


module.exports = Tap;
