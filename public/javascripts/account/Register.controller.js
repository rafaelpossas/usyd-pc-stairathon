/**
 * Created by rafaelpossas on 3/29/15.
 */
app.controller('registerCtrl',['$scope','$rootScope','$http','alert','authToken','$location','auth','faculty',
  function($scope,$rootScope,$http,alert,authToken,$location,auth,faculty){
  $('ul.nav.nav-pills li#register').addClass('active').siblings().removeClass('active');
  $scope.faculties = [];

  (function(){
    getFaculties();
  }());

  function getFaculties(){
    faculty.getFaculties()
        .then(function(data){
          $scope.faculties = data;
        })
  }
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