/**
 * Created by rafaelpossas on 11/10/2015.
 */
/**
 * Created by rafaelpossas on 23/09/15.
 */
'use strict';

app.service('bracket',['$http','$q','API_URL', function ($http,$q,API_URL) {

    this.saveBracket =  function(bracket){
        var deferred = $q.defer();

        $http.post(API_URL+'bracket',{bracket: bracket})
            .success(function(bracket){
                deferred.resolve(bracket)
            })
            .error(function(data){

                var msg;
                if(data!=null){
                    msg = data.message;
                }else{
                    msg = "Connection Refused";
                }

                alert('warning',"Unable to save bracket!",' Reason: '+msg);
                deferred.reject(msg);
            })
        return deferred.promise;
    }
    this.getBrackets = function(){
        var deferred = $q.defer();
        $http.get(API_URL+'bracket')
            .success(function(brackets){
                deferred.resolve(brackets)
            })
            .error(function(data,status){

                var msg;
                if(data!=null){
                    msg = data.message;
                }else{
                    msg = "Connection Refused";
                }

                alert('warning',"Unable to get brackets!",' Reason: '+msg);
                deferred.reject(msg);
            })
        return deferred.promise;

    }
    this.getBracketResult = function(id){
        var deferred = $q.defer();
        $http.get(API_URL+'bracket/'+id+"/result")
            .success(function(brackets){
                deferred.resolve(brackets)
            })
            .error(function(data,status){

                var msg;
                if(data!=null){
                    msg = data.message;
                }else{
                    msg = "Connection Refused";
                }

                alert('warning',"Unable to get brackets!",' Reason: '+msg);
                deferred.reject(msg);
            })
        return deferred.promise;
    }
    this.getBracketByFaculty = function getBracketByFaculty(faculty){
        var deferred = $q.defer();
        if(faculty){
            var url = API_URL+"bracket";
            $http({
                url: url,
                method: "GET",
                params: {faculty: faculty}
            }).success(function(data){
                deferred.resolve(data);
            }).error(function(data){
                var msg;
                if(data!=null){
                    msg = data.message;
                }else{
                    msg = "Connection Refused";
                }

                alert('warning',"Unable to get bracket!",' Reason: '+msg);
                deferred.reject(msg);
            });
        }
        return deferred.promise;
    }
    this.removeBracket = function(bracket){
        var deferred = $q.defer();
        $http.delete(API_URL+'bracket/'+bracket._id)
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

                alert('warning',"Unable to remove bracket!",' Reason: '+msg);
                deferred.reject(msg);
            })
        return deferred.promise;

    }

}]);
