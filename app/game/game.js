'use strict';

angular.module('myApp.game', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/game', {
            templateUrl: 'game/game.html',
            controller: 'GameCtrl'
        });
    }])

    .controller('GameCtrl', ["$scope", "$location", function($scope, $location) {
        $scope.cellStyle= {
            'height': '20px',
            'width': '20px',
            'border': '1px solid black',
            'text-align': 'center',
            'vertical-align': 'middle',
            'cursor': 'pointer'
        };

        $scope.mydirtyfix = {};

        $scope.reset = function() {
            $scope.mydirtyfix.board = [
                ['', '', ''],
                ['', '', ''],
                ['', '', '']
            ];
            $scope.mydirtyfix.nextMove = 'X';
            $scope.mydirtyfix.winner = '';
            setUrl();
        };

        $scope.dropPiece = function(row, col) {
            if (!$scope.mydirtyfix.winner && !$scope.mydirtyfix.board[row][col]) {
                $scope.mydirtyfix.board[row][col] = $scope.mydirtyfix.nextMove;
                $scope.mydirtyfix.nextMove = $scope.mydirtyfix.nextMove == 'X' ? 'O' : 'X';
                setUrl();
            }
        };

        $scope.reset();
        $scope.$watch(function() { return $location.search().board;}, readUrl);

        function setUrl() {
            var rows = [];
            angular.forEach($scope.mydirtyfix.board, function(row) {
                rows.push(row.join(','));
            });
            $location.search({board: rows.join(';') + '/' + $scope.mydirtyfix.nextMove});
        }

        function grade() {
            var b = $scope.mydirtyfix.board;
            $scope.mydirtyfix.winner =
                row(0) || row(1) || row(2) ||
                col(0) || col(1) || col(2) ||
                diagonal(-1) || diagonal(1);
            function row(row) { return same(b[row][0], b[row][1], b[row][2]);}
            function col(col) { return same(b[0][col], b[1][col], b[2][col]);}
            function diagonal(i) { return same(b[0][1-i], b[1][1], b[2][1+i]);}
            function same(a, b, c) { return (a==b && b==c) ? a : '';};
        }

        function readUrl(value) {
            if (value) {
                value = value.split('/');
                $scope.mydirtyfix.nextMove = value[1];
                angular.forEach(value[0].split(';'), function(row, col){
                    $scope.mydirtyfix.board[col] = row.split(',');
                });
                grade();
            }
        }
    }]);
