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

            var addTrack = function(trackId) {
                var self = this;
                SC.get('/tracks/' + trackId, function(res) {
                    if(res) {
                        var track = {
                            title: res.title,
                            artist: res.user.username,
                            scObj: res
                        };

                        self.unshift(track);
                        console.log(self);
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
                volume: '', // 0 -1
                pitch: '', // 0 - 1
                playspeed: '', // 1 = 100% controlled by crossfade: -1 + 1
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

            $scope.playNextLeft = function() {
                if($scope.left.tracks.count > 0) {

                }
            };

            $scope.playNextRight = function() {
                if($scope.right.tracks.count > 0) {

                }
            };


            addTrack.call($scope.left.tracks, 13158665);
        }

);