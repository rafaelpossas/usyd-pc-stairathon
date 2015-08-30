/**
 * Created by rafaelpossas on 4/28/15.
 */
app.service('auth',['$http','API_URL','authToken','$rootScope','$window','$q','authToken',function($http,API_URL,authToken,$rootScope,$window,$q,authToken){
  var storage = $window.localStorage;
  function authSuccessful(res){
    $rootScope.user = res.user;
    $rootScope.isAuthenticated = true;
    storage.setItem('user',res.user);
    authToken.setToken(res.token);
  }

  this.authenticateUserForRoute = function(){
    if(authToken.isAuthenticated()){
      return true;
    }else{
      return $q.reject('not authorized');
    }
  }
  this.login = function(email,password){
    var url = API_URL + 'users/login';
    return $http.post(url,{email:email,password:password}).success(authSuccessful);
  }
  this.register = function(email,password){
    var url = API_URL + 'users/register';
    return $http.post(url,{email:email,password:password}).success(authSuccessful);
  }
}])