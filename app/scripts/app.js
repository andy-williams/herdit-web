'use strict';

/**
 * @ngdoc overview
 * @name herditWebApp
 * @description
 * # herditWebApp
 *
 * Main module of the application.
 */
var herdit = angular.module('herdit', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'pubnub.angular.service'
]);


herdit.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/room.html',
            controller: 'RoomCtrl'
        })
        .when('/about', {
            templateUrl: 'views/about.html',
            controller: 'AboutCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
});

herdit.controller('RoomListCtrl', [
    '$scope',
    function ($scope) {
        $scope.rooms = [];
    }
]);

