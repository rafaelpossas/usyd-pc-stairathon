/**
 * Created by rafaelpossas on 4/28/15.
 */
app.service('auth', ['$http', 'API_URL', 'authToken', '$rootScope', '$window', '$q', 'authToken', function ($http, API_URL, authToken, $rootScope, $window, $q, authToken) {
    var storage = $window.localStorage;

    function authSuccessful(res) {
        $rootScope.user = res.user;
        $rootScope.isAuthenticated = true;
        storage.setItem('user', JSON.stringify(res.user));
        authToken.setToken(res.token);
        $rootScope.user = res.user;
    }

    this.authenticateUserForRoute = function () {
        if (authToken.isAuthenticated()) {
            return true;
        } else {
            return $q.reject('not authorized');
        }
    }
    this.authenticateAdminForRoute = function () {
        return true;
    }
    this.login = function (email, password) {
        var url = API_URL + 'user/login';
        return $http.post(url, {email: email, password: password}).success(authSuccessful);
    }
    this.register = function (email, password) {
        var url = API_URL + 'user/register';
        return $http.post(url, {email: email, password: password}).success(authSuccessful);
    }
}])