/**
 * Created by rafaelpossas on 5/09/15.
 */
/**
 * Created by rafaelpossas on 2/09/15.
 */

var TapsController = function(){
    var Tap = require('../models/Tap');
    var User = require('../models/User');
    var getTaps = function(req,res,next){
        Tap.model.find({}).exec(function(err,collection){
            if(err) next(err);
            else
                res.status(200).send(collection);
        });
    }
    var checkInterval = function(taps,currentTap,interval){
        var isTapOk = true;
        if(taps.length>0){
            taps.forEach(function(tap){
                if(tap.hour === currentTap.hour
                    && (tap.minutes+interval) >= currentTap.minutes && tap.uid === currentTap.uid){
                    isTapOk = false;
                    return;
                }
            });
        }else{
            return isTapOk;
        }
        return isTapOk;
    }
    var createTap = function(user){
        var now = new Date();
        return {uid:user.uniKey,faculty:user.faculty.name,hour: now.getHours(),minutes:now.getMinutes()}
    }
    var getTapsByUser = function(req,res,next){
        var promise = Tap.schema.methods.findByUniKey(req.params.uid);
        promise
            .then(function(data){
                res.status(200).send(data);
            },function(err){
                res.status(501).send({message: err});
            })
    }
    var saveTap = function(req,res,next){

        var id = req.body.id.toUpperCase();
        var user;
        if(!id){
            res.status(400).send({message: "The ID was not sent or not found within the request Header"});
        }else{
            var promise = User.schema.methods.findByRFID(id);
            promise
                .then(function(doc){
                    if(doc && doc.length>0){
                        user = doc[0];
                        return Tap.schema.methods.findWithinDay(new Date());
                    }else{
                        return res.status(500).send({message:"The user does not exist"});
                    }
                })
                .then(function(doc){
                    if(doc && doc.length > 0 ){
                        try{
                            var currentTap = createTap(user);
                            var isIntervalOk = checkInterval(doc[0].tapData,currentTap,5);
                            if(isIntervalOk){
                                doc[0].tapData.push(currentTap);
                                doc[0].save(function(err){
                                    if(err) res.status(500).send({message: err.message});
                                    res.status(200).send({status: "ok"});
                                });

                            }else{
                                res.status(202).send({message: "You can only tap once within a 5 minutes interval"});
                            }

                        }catch(e){
                            res.status(500).send({message: e.stack});
                        }
                    }else{
                        Tap.schema.methods.createTap()
                            .then(function(doc){
                                try{
                                    var currentTap = createTap(user);
                                    doc.tapData.push(currentTap);
                                    doc.save(function(err){
                                        if(err) res.status(500).send({message: err.message});
                                        res.status(200).send({status: "ok"});
                                    });
                                }catch(e){
                                    res.status(500).send({message: e.stack});
                                }
                            },function(err){
                                res.status(500).send({message: err.message});
                            })
                    }
                },function(err){
                    res.status(500).send({message: err.message});
                });

        }

    }
    return {
        getTaps: getTaps,
        saveTap: saveTap,
        getTapsByUser: getTapsByUser
    }
}();

module.exports = TapsController;