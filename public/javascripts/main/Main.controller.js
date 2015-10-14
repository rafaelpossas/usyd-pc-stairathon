/**
 * Created by rafaelpossas on 3/29/15.
 */
app.controller('mainCtrl', ['authToken', '$rootScope', '$http','$scope','API_URL','bracket', function (authToken, $rootScope, $http,$scope,API_URL,bracket) {
    $('ul.nav.nav-pills li#home').addClass('active').siblings().removeClass('active');

    $rootScope.isAuthenticated = authToken.isAuthenticated();
    $scope.taps = [];
    $scope.allBrackets = [];
    $scope.currentBracket = {};
    (function () {
        if($rootScopenpisAuthenticated){
            $http.get(API_URL + 'tap/user/' + $rootScope.user.uniKey)
                .success(function (faculties) {
                    $scope.taps = faculties;
                })
            bracket.getBracketByFaculty($rootScope.user.faculty)
                .then(function(docs){
                    $scope.allBrackets = docs;
                });
        }

    })();

    $scope.getBracketResult = function(id){
        bracket.getBracketResult(id)
            .then(function(data){
                $scope.currentBracket = data;
            })
    }

}])