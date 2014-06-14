'use strict';

/**
 * @ngdoc function
 * @name herditWebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the herditWebApp
 */
angular.module('herdit')
    .controller('AboutCtrl', function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    });
