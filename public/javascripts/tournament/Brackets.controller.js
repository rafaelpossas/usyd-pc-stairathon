/**
 * Created by rafaelpossas on 20/08/2015.
 */
app.controller('bracketsCtrl', ['$scope', 'faculty', 'alert', 'bracket','$location', function ($scope, faculty, alert, bracket,$location) {

    $('ul.nav.nav-pills li#brackets').addClass('active').siblings().removeClass('active');
    $scope.rounds = [
        {
            value: 4,
            minimum: 8,
            description: "3 Rounds / 8 teams"
        },
        {
            value: 2,
            minimum: 4,
            description: "2 Rounds / 4 Teams"
        },
        {
            value: 1,
            minimum: 2,
            description: "1 Round / 2 Teams"
        }

    ];
    $scope.roundLength = [
        {
            description: "Daily"
        },
        {
            description: "Weekly"
        },
        {
            description: "Monthly"
        }
    ];
    $scope.currentRoundLength = {};
    $scope.currentRound = {};
    $scope.currentFaculty = {};
    $scope.faculties = [];
    $scope.selectedFaculties = [];
    $scope.allBrackets = [];
    $scope.name = "";


    (function () {
        $scope.currentRoundLength = $scope.roundLength[0];
        $scope.currentRound = $scope.rounds[0];
        faculty.getFaculties()
            .then(function (data) {
                $scope.faculties = data;
                $scope.currentFaculty = $scope.faculties[0];
            });
        getBrackets();
    })();

    function setTeamString(bracket){
        var teamsString= "";
        bracket.faceoff.forEach(function(faceoff){
            teamsString += faceoff.team1.name+', ';
            teamsString += faceoff.team2.name+','
        });
        teamsString = teamsString.substring(0,teamsString.length-1);
        bracket.teams = teamsString;
    };
    function getBrackets(){
        bracket.getBrackets()
            .then(function(data){
                $scope.allBrackets = data;
                $scope.allBrackets.forEach(function(bracket){
                    setTeamString(bracket);
                })
            });
    };
    $scope.removeBracket = function removeBracket(currentBracket){
        bracket.removeBracket(currentBracket)
            .then(function(msg){
                getBrackets();
                alert('success','Success: ','The Bracket was successfully removed!');
            })
    };
    $scope.addTeam = function addTeam() {
        var hasTeam = false;
        $scope.selectedFaculties.forEach(function (data) {
            if (data._id === $scope.currentFaculty._id) {
                hasTeam = true;
            }
        });
        if (!hasTeam)
            $scope.selectedFaculties.push($scope.currentFaculty);
        else
            alert('warning', 'Can\'t add team: ', 'The team already exists');
    };
    $scope.removeTeam = function removeTeam(team) {
        for (var i = $scope.selectedFaculties.length; i--;) {
            if ($scope.selectedFaculties[i]._id === team._id) {
                $scope.selectedFaculties.splice(i, 1);
            }
        }
    };
    $scope.clearForm = function clearForm(){
        $scope.name = "";
        $scope.selectedFaculties = [];
        $scope.currentRoundLength = $scope.roundLength[0];
        $scope.currentRound = $scope.rounds[0];

    };
    $scope.saveBracket = function () {
        if ($scope.selectedFaculties.length < $scope.currentRound.minimum) {
            alert('warning', 'Not enough teams were added. ', 'Minimum: ' + $scope.currentRound.minimum);
        }
        else {
            var bracketModel = {
                name: $scope.name,
                rounds: $scope.currentRound.value,
                length: $scope.currentRoundLength.description,
                teams: $scope.selectedFaculties
            };
            bracket.saveBracket(bracketModel)
                .then(function(doc){
                    setTeamString(doc.bracket);
                    $scope.allBrackets.push(doc.bracket);
                    alert('success','Success: ','The Bracket was saved!');

                });
        }
    }


}]);
