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
    'ngRoute',
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

herdit.config(function($sceProvider) {
    $sceProvider.enabled(false);
  });

herdit.controller('RoomListCtrl', [
    '$scope',
    function ($scope) {
        $scope.rooms = [];
    }
]);

