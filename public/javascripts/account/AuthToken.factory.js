/**
 * Created by rafaelpossas on 4/12/15.
 */
'user strict'

app.factory('authToken',['$window','$rootScope',function($window,$rootScope){
  var storage = $window.localStorage;
  var cachedToken;
  var authToken = {
    setToken: function (token){
      cachedToken = token;
      storage.setItem('userToken',token);
      $rootScope.isAuthenticated = true;
    },
    getToken: function (){
      if(!cachedToken){
        cachedToken = storage.getItem('userToken');
      }
      return cachedToken;
    },
    isAuthenticated: function(){
      return !!authToken.getToken();
    },
    removeToken: function(){
      cachedToken = null;
      storage.removeItem('userToken');
      $rootScope.isAuthenticated = false;
    }
  }
  return authToken;
}])