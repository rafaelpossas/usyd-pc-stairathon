var app = angular.module('procymo-admin',['ngRoute','ngAnimate']);

(function(){

  app.config(function($routeProvider,$locationProvider,$httpProvider){

    $locationProvider.html5Mode({enabled: true,requireBase: false});

    var routeRoleChecks = {
      user: {
        auth: function(auth){
          return auth.authenticateUserForRoute();
        }
      }
    }
    $routeProvider
        .when("/",{templateUrl: '/html/main/main.html',controller: 'mainCtrl'})
        .when("/register",{templateUrl:'/html/account/register.html',controller:'registerCtrl'})
        .when("/logout",{templateUrl: '/html/main/main.html',controller: 'logoutCtrl'})
        .when("/jobs",{templateUrl: '/html/job/jobs.html',controller:'jobCtrl',resolve: routeRoleChecks.user})
        .when("/brackets",{templateUrl: '/html/tournament/brackets.html',controller:'bracketsCtrl',resolve: routeRoleChecks.user})
        .when("/login",{templateUrl:'/html/account/login.html',controller: 'loginCtrl'})
        .otherwise({redirectTo:'/'});

    $httpProvider.interceptors.push('authInterceptor');
  })
  .constant('API_URL','http://localhost:3000/');


  app.run(function($rootScope,$location,alert){
    $rootScope.$on('$routeChangeError', function(evt,current,previous,rejection) {
      if(rejection === 'not authorized'){
        $location.path('/');
        alert('warning','Ooops! You are not authorized to see this page');
      }
      /* Act on the event */
    })

  });


})();