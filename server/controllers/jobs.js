/**
 * Created by rafaelpossas on 4/16/15.
 */
var jwt = require('jwt-simple')
exports.getJobs = function(){
  return function(req,res){
/*    var success = function(data){
      console.log('The response was: '+data);
    }
    var error = function(error){
      console.log(error);
    }
    var req = servers.pingServer("reframax.procymo.com.br","/servlet/ping",success,error);*/


    var jobs = [
      'Angular Developer',
      'Data Scientist',
      'NodeJS Developer',
      'Database Analyst'
    ]
    res.send(jobs)
  }
}