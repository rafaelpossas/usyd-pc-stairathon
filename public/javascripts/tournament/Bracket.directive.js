(function () {
    'use strict';

    function bracketDirective() {
        return {
            scope: {
                bracketData: '='
            },
            link: function ($scope, element, attrs) {
                var round_2_left, round_2_right, round_4_right,
                    round_4_left, round_8_left, round_8_right,
                    round_1_left, round_1_right;

                $scope.$watch("bracketData", function (oldVal, newVal) {
                    var faceoff = $scope.bracketData.faceoff;
                    var groupByRound;
                    var nodes = [];

                    groupByRound = _.sortBy(_.groupBy(faceoff, 'round'), function (item) {
                            return -item.round;
                    });


                    if(element.children().length > 0)
                        element.remove('.main-bracket')

                    if(faceoff && faceoff.length > 0)
                        element.append(getBracketHTML($scope.bracketData.rounds));

                    round_2_left = angular.element(document.getElementsByClassName('round-2-left'));
                    round_2_right = angular.element(document.getElementsByClassName('round-2-right'));
                    round_4_right = angular.element(document.getElementsByClassName('round-4-right'));
                    round_4_left = angular.element(document.getElementsByClassName('round-4-left'));
                    round_8_left = angular.element(document.getElementsByClassName('round-8-left'));
                    round_8_right = angular.element(document.getElementsByClassName('round-8-right'));
                    round_1_left = angular.element(document.getElementsByClassName('round-1-left'));
                    round_1_right = angular.element(document.getElementsByClassName('round-1-right'));

                    _.each(groupByRound, function (matchesByRound) {
                        createBracket(matchesByRound);
                    });
                },true);



                function getBracketHTML(round) {
                    var bracket = "<main class='main-bracket'>";
                    bracket += getMatches("left", round);
                    bracket += getMatches("right", round);
                    bracket += "</main>";
                    return bracket;
                }

                function getMatches(position, round) {
                    var result = "";
                    var container;
                    var matches = "";

                    function getMatchesString(round, position) {
                        var matches = "";
                        if (round >= 2) {
                            matches += '<li class="spacer">&nbsp;</li>\n' +
                                '<li class="game game-top"><span></span></li>\n' +
                                '<li class="game game-spacer-' + position + '">&nbsp;</li>\n' +
                                '<li class="game game-bottom "><span></span></li>\n';
                        } else {
                            matches += '<li class="spacer">&nbsp;</li>\n' +
                                '<li class="game game-top"><span></span></li>';
                        }
                        return matches;
                    }

                    if (position === "left") {
                        for (var j = round; j >= 1; j = j / 2) {
                            container = '<ul class="round round-' + j + '-' + position + '">';
                            matches = "";
                            for (var i = 0; i < j / 2; i++) {
                                matches += getMatchesString(j, position);
                            }
                            result += container + matches + '<li class="spacer">&nbsp;</li>' +
                                '</ul>';
                        }
                    }

                    if (position === "right") {
                        for (var j = 1; j <= round; j = j * 2) {
                            container = '<ul class="round round-' + j + '-' + position + '">';
                            matches = "";
                            for (var i = 0; i < j / 2; i++) {
                                matches += getMatchesString(j, position);
                            }
                            result += container + matches + '<li class="spacer">&nbsp;</li>' +
                                '</ul>';
                        }
                    }

                    return result;
                }

                function createBracket(matchesByRound) {
                    if (matchesByRound[0].round === 8) {
                        round_8_left.children()[1]
                            .innerHTML = matchesByRound[0].team1.name + '<span>' + matchesByRound[0].team1.result + '</span>';
                        round_8_left.children()[3]
                            .innerHTML = matchesByRound[0].team2.name + '<span>' + matchesByRound[0].team2.result + '</span>';
                        round_8_left.children()[5]
                            .innerHTML = matchesByRound[1].team1.name + '<span>' + matchesByRound[1].team1.result + '</span>';
                        round_8_left.children()[7]
                            .innerHTML = matchesByRound[1].team2.name + '<span>' + matchesByRound[1].team2.result + '</span>';
                        round_8_left.children()[9]
                            .innerHTML = matchesByRound[2].team1.name + '<span>' + matchesByRound[2].team1.result + '</span>';
                        round_8_left.children()[11]
                            .innerHTML = matchesByRound[2].team2.name + '<span>' + matchesByRound[2].team2.result + '</span>';
                        round_8_left.children()[13]
                            .innerHTML = matchesByRound[3].team1.name + '<span>' + matchesByRound[3].team1.result + '</span>';
                        round_8_left.children()[15]
                            .innerHTML = matchesByRound[3].team2.name + '<span>' + matchesByRound[3].team2.result + '</span>';

                        round_8_right.children()[1]
                            .innerHTML = matchesByRound[0].team1.name + '<span>' + matchesByRound[0].team1.result + '</span>';
                        round_8_right.children()[3]
                            .innerHTML = matchesByRound[0].team2.name + '<span>' + matchesByRound[0].team2.result + '</span>';
                        round_8_right.children()[5]
                            .innerHTML = matchesByRound[1].team1.name + '<span>' + matchesByRound[1].team1.result + '</span>';
                        round_8_right.children()[7]
                            .innerHTML = matchesByRound[1].team2.name + '<span>' + matchesByRound[1].team2.result + '</span>';
                        round_8_right.children()[9]
                            .innerHTML = matchesByRound[2].team1.name + '<span>' + matchesByRound[2].team1.result + '</span>';
                        round_8_right.children()[11]
                            .innerHTML = matchesByRound[2].team2.name + '<span>' + matchesByRound[2].team2.result + '</span>';
                        round_8_right.children()[13]
                            .innerHTML = matchesByRound[3].team1.name + '<span>' + matchesByRound[3].team1.result + '</span>';
                        round_8_right.children()[15]
                            .innerHTML = matchesByRound[3].team2.name + '<span>' + matchesByRound[3].team2.result + '</span>';

                    } else if (matchesByRound[0].round === 4) { //quarters
                        round_4_left.children()[1]
                            .innerHTML = matchesByRound[0].team2.name + '<span>' + matchesByRound[0].team2.result + '</span>';
                        round_4_left.children()[3]
                            .innerHTML = matchesByRound[0].team1.name + '<span>' + matchesByRound[0].team1.result + '</span>';
                        round_4_left.children()[5]
                            .innerHTML = matchesByRound[1].team2.name + '<span>' + matchesByRound[1].team2.result + '</span>';
                        round_4_left.children()[7]
                            .innerHTML = matchesByRound[1].team1.name + '<span>' + matchesByRound[1].team1.result + '</span>';
                        round_4_right.children()[1]
                            .innerHTML = matchesByRound[2].team1.name + '<span>' + matchesByRound[2].team1.result + '</span>';
                        round_4_right.children()[3]
                            .innerHTML = matchesByRound[2].team2.name + '<span>' + matchesByRound[2].team2.result + '</span>';
                        round_4_right.children()[5]
                            .innerHTML = matchesByRound[3].team1.name + '<span>' + matchesByRound[3].team1.result + '</span>';
                        round_4_right.children()[7]
                            .innerHTML = matchesByRound[3].team2.name + '<span>' + matchesByRound[3].team2.result + '</span>';
                    } else if (matchesByRound[0].round === 2) { //semifinals
                        round_2_left.children()[1]
                            .innerHTML = matchesByRound[0].team1.name + '<span>' + matchesByRound[0].team1.result + '</span>';
                        round_2_left.children()[3]
                            .innerHTML = matchesByRound[0].team2.name + '<span>' + matchesByRound[0].team2.result + '</span>';
                        round_2_right.children()[1]
                            .innerHTML = matchesByRound[1].team1.name + '<span>' + matchesByRound[1].team1.result + '</span>';
                        round_2_right.children()[3]
                            .innerHTML = matchesByRound[1].team2.name + '<span>' + matchesByRound[1].team2.result + '</span>';
                    } else if (matchesByRound[0].round === 1) { //final
                        round_1_left.children()[1]
                            .innerHTML = matchesByRound[0].team1.name + '<span>' + matchesByRound[0].team1.result + '</span>';
                        round_1_right.children()[1]
                            .innerHTML = matchesByRound[0].team2.name + '<span>' + matchesByRound[0].team2.result + '</span>';
                    }
                };
            }
        };
    }

    app
        .directive('bracketDirective', bracketDirective);
})();