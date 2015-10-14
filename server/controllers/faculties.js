/**
 * Created by rafaelpossas on 2/09/15.
 */

var FacultiesController = function(){
    var Faculty = require('../models/Faculty');

    var getFaculties = function(req,res,next){
        Faculty.model.find({}).exec(function(err,collection){
            if(err) next(err);
            else
                res.status(200).send(collection);
        });
    }
    var saveFaculty = function(req,res,next){
        var promise = Faculty.schema.methods.saveFaculty(req.body.faculty.name);
        promise.then(function(doc){
            res.status(200).send({faculty:doc});
        },function(error){
            next(error);
        })
    }
    var removeFaculty = function (req, res, next) {
        Faculty.model.findOneAndRemove({_id: req.params.id}, function (err) {
            if (err) next(err);
            res.status(200).send({message: "ok"});
        });
    }
    return {
        getFaculties: getFaculties,
        saveFaculty: saveFaculty,
        removeFaculty: removeFaculty
    }
}();

module.exports = FacultiesController;