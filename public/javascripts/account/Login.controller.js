app.controller('loginCtrl',['$scope','alert','$location','auth',function($scope,alert,$location,auth){
  $('ul.nav.nav-pills li#login').addClass('active').siblings().removeClass('active');

  $scope.submit = function(){
    auth.login($scope.email,$scope.password)
      .success(function(res){

        alert('success','Welcome','Thanks for comming back '+res.user.email+'!');

        $location.path('/');

      })
      .error(function(err){
        alert('warning','Opps! Something went wrong :(',err.message);
      });
  }
}])