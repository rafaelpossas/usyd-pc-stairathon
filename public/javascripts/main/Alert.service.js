'use strict';

app.service('alert', function alert($rootScope, $timeout) {
    var alertTimeout;

    //    $rootScope.$on('$stateChangeStart',
    //        function(event, toState, toParams, fromState, fromParams) {
    //            $rootScope.alert.hide = true;
    //            $rootScope.alert.show = false;
    //            console.log($rootScope.alert.show);
    //        })
    //    $rootScope.$on('$stateChangeSuccess',
    //        function(event, toState, toParams, fromState, fromParams) {
    //            $timeout.cancel(alertTimeout);
    //            //$rootScope.alert.hide = false;
    //        })

    return function(type, title, message, timeout) {
        $rootScope.alert = {
            hasBeenShown: true,
            show: true,
            type: type,
            message: message,
            title: title
        };
        $timeout.cancel(alertTimeout);
        alertTimeout = $timeout(function() {
            $rootScope.alert.show = false;
        }, timeout || 2000);
    }


});
