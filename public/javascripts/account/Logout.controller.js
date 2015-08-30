/**
 * Created by rafaelpossas on 4/15/15.
 */
'user strict';

app.controller('logoutCtrl',['authToken','$location','$route',function(authToken,$location){
  authToken.removeToken();
  $location.path('/');
}])