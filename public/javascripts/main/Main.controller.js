/**
 * Created by rafaelpossas on 3/29/15.
 */
app.controller('mainCtrl',['$scope','$rootScope','alert',function($scope,$rootScope,alert){
  $('ul.nav.nav-pills li#home').addClass('active').siblings().removeClass('active');

}])