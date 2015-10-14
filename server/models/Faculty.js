/**
 * Created by rafaelpossas on 2/09/15.
 */
/**
 * Created by rafaelpossas on 3/27/15.
 */


var Faculty = function(){
    var mongoose = require('mongoose');
    var Q = require('q');
    var FacultySchema = mongoose.Schema({
        name: {type:String,required: '{PATH} is required'},
        numOfParticipants: {type:Number,default:0}
    });

    FacultySchema.methods = {
        createDefaultFaculties: function (){
            _model.find({}).exec(function(err,collection){
                if(collection.length === 0){
                    _model.create({name: 'Information Technologies',numOfParticipants:0});
                    _model.create({name: 'Health Sciences',numOfParticipants:0});
                    _model.create({name: 'Law',numOfParticipants:0});
                    _model.create({name: 'Engineering',numOfParticipants:0});
                }
            })
        },
        saveFaculty: function(facultyName){
            var deferred = Q.defer();
            _model.create({name:facultyName},function(err,doc){
                if(err) deferred.reject(err);
                deferred.resolve(doc);
            });
            return deferred.promise;
        },
        findAll: function(){
            return _model.find({}).exec();
        },
        findByName: function(name,success,fail){
            _model.find({name:name}).exec(function(err,collection){
              if(err) fail(err);
              else success(collection);
            })
        }
    };
    var _model = mongoose.model('Faculty',FacultySchema);

    return{
        model: _model,
        schema: FacultySchema
    }

}();


module.exports = Faculty;
