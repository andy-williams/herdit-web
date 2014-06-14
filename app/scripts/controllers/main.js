'use strict';

/**
 * @ngdoc function
 * @name herditWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the herditWebApp
 */
angular.module('herdit')
    .controller('RoomCtrl',
        function ($scope, PubNub) {

            var addTrack = function(which, trackId) {
                SC.get('/tracks/' + trackId, function(res) {
                    if(res) {
                        var track = {
                            title: res.title,
                            artist: res.user.username,
                            scObj: res
                        };

                        if(!which.playing) {
                            which.playing = track;
                        } else {
                            which.tracks.unshift(track);
                        }
                        $scope.$apply();
                    }
                });
            }

            PubNub.init({publish_key:'demo',subscribe_key:'demo'});

            PubNub.ngSubscribe({
                channel: 'herdit_dj_left',
                message: function(m) {
                    console.log(m); // do something with instructions
                },
                presence: function(m) {}
            });

            PubNub.ngSubscribe({
                channel: 'herdit_dj_right',
                message: function() {},
                presence: function() {}
            });

            $scope.left = {
                playing: null,
                config: {
                    volume: 1, // 0 -1
                    pitch: 1, // 0 - 1
                    playspeed: 1 // 1 = 100% controlled by crossfade: -1 + 1
                },
                tracks: [
                ]
            };

            $scope.right = {
                playing: null,
                volume: '', // 0 -1
                pitch: '', // 0 - 1
                playspeed: '', // 1 = 100% controlled by crossfade: -1 + 1
                tracks: [
                    {
                        scObj: {},
                        title: 'The title',
                        artist: 'Trumpets'
                    }
                ]
            };

            $scope.playNext = function(which) {
                if($scope.left.tracks.count > 0) {
                    which.playing = which.tracks.pop();
                }
            };

            // watch playing
            (function() {
                $scope.$watch(function() {
                    return $scope.left.playing
                }, function(oldVal, newVal) {
                    if(!newVal) {
                        $scope.playNext($scope.left);
                    }
                }, true);
                
                $scope.$watch(function() {
                    return $scope.right.playing
                }, function(oldVal, newVal) {
                    if(!newVal) {
                        $scope.playNext($scope.right);
                    }
                }, true);
            })();            

            window.addTrack = function() {
                addTrack($scope.left, 13158665);  
            }
            
        }

);