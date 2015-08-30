/**
 * Created by rafaelpossas on 3/29/15.
 */
app.controller('registerCtrl',['$scope','$rootScope','$http','alert','authToken','$location','API_URL','auth',function($scope,$rootScope,$http,alert,authToken,$location,API_URL,auth){
  $('ul.nav.nav-pills li#register').addClass('active').siblings().removeClass('active');

  $scope.submit = function(){

    auth.register($scope.email,$scope.password)
      .success(function(res){
        alert('success','Welcome',res.user.email);

        $location.path('/');
      })
      .error(function(err){
        alert('warning','Opps! Something went wrong :(',err.message);
      });
  }
}])