/**
 * Created by rafaelpossas on 4/12/15.
 */
'user strict'

app.controller('headerCtrl',['authToken','$rootScope',function(authToken,$rootScope){
  $rootScope.isAuthenticated = authToken.isAuthenticated();
}])