/**
 * Created by rafaelpossas on 2/09/15.
 */
app.controller('facultyCtrl', ['$scope','faculty','alert', function ($scope,faculty,alert) {

    $scope.faculties = [];
    $scope.name = "";

    (function(){
        getFaculties();
        $('ul.nav.nav-pills li#faculties')
            .addClass('active').siblings().removeClass('active');

    }());
    function getFaculties(){
        faculty.getFaculties()
            .then(function(data){
                $scope.faculties = data;
            });
    }
    $scope.addFaculty = function(){
        debugger
        var fc = {
            name: $scope.name
        };
        faculty.addFaculty(fc)
            .then(function(doc){
                getFaculties();
                alert('success','Success: ','The Faculty was saved!');

            });
    }

    $scope.removeFaculty = function(fc){
        faculty.removeFaculty(fc)
            .then(function(msg){
                getFaculties();
                alert('success','Success: ','The Faculty was successfully removed!');
            });
    }


}])