/**
 * Created by rafaelpossas on 23/09/15.
 */
'use strict';

app.service('faculty',['$http','$q','API_URL', function ($http,$q,API_URL) {

    this.getFaculties =  function(){
        var deferred = $q.defer();

        $http.get(API_URL+'faculty')
            .success(function(faculties){
                deferred.resolve(faculties)
            })
            .error(function(data,status){

                var msg;
                if(data!=null){
                    msg = data.message;
                }else{
                    msg = "Connection Refused";
                }

                alert('warning',"Unable to get faculties!",' Reason: '+msg);
                deferred.reject(msg);
            })
        return deferred.promise;
    }
    this.removeFaculty = function(faculty){
        var deferred = $q.defer();
        $http.delete(API_URL+'faculty/'+faculty._id)
            .success(function(msg){
                deferred.resolve(msg)
            })
            .error(function(data,status){

                var msg;
                if(data!=null){
                    msg = data.message;
                }else{
                    msg = "Connection Refused";
                }

                alert('warning',"Unable to remove faculty!",' Reason: '+msg);
                deferred.reject(msg);
            })
        return deferred.promise;
    }
    this.addFaculty = function(faculty){
        var deferred = $q.defer();

        $http.post(API_URL+'faculty',{faculty: faculty})
            .success(function(faculty){
                deferred.resolve(faculty)
            })
            .error(function(data){

                var msg;
                if(data!=null){
                    msg = data.message;
                }else{
                    msg = "Connection Refused";
                }

                alert('warning',"Unable to save faculty!",' Reason: '+msg);
                deferred.reject(msg);
            })
        return deferred.promise;
    }

}]);
