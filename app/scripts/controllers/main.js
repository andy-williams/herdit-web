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
            $scope.leftAudio;
            $scope.rightAudio; // context, buffer, nodes etc.

            PubNub.init({publish_key:'demo',subscribe_key:'demo'});

            PubNub.ngSubscribe({
                channel: 'herdit_dj_left_1',
                message: function(m) {
                    var command = m[0];

                    console.log(command);

                    if(command.trackID) {
                        addTrack($scope.left, command.trackID);
                    }

                    if(command["tempo"] != null) {
                        console.log(command.tempo);
                        $scope.left.config.tempo = command.tempo * 2;
                        $scope.$apply();
                    }
                    
                },
                presence: function(m) {}
            });

            window.changeTempo = function(val) {
                $scope.leftAudio.source.playbackRate.value = val;
                $scope.$apply();
            }

            PubNub.ngSubscribe({
                channel: 'herdit_dj_right_1',
                message: function(m) {
                    var command = m[0];

                    console.log(command);

                    if(command.trackID) {
                        addTrack($scope.right, command.trackID);
                    }

                    if(command.tempo) {
                        console.log(command.tempo);
                        $scope.right.config.tempo = command.tempo * 2;
                        $scope.$apply();
                    }

                },
                presence: function() {}
            });

            $scope.left = {
                playing: null,
                config: {
                    volume: 1, // 0 -1
                    pitch: 1, // 0 - 1
                    tempo: 1 // 1 = 100% controlled by crossfade: -1 + 1
                },
                tracks: [
                ]
            };

            $scope.right = {
                playing: null,
                config: {
                    volume: 1, // 0 -1
                    pitch: 1, // 0 - 1
                    tempo: 1 // 1 = 100% controlled by crossfade: -1 + 1
                },
                tracks: []
            };

            $scope.playNext = function(which) {
                if(which.tracks.length > 0) {
                    which.playing = which.tracks.shift();
                }
            };

            var playStream = function(url, config, which) {
                console.log("called");

                getAudioContextAndBuffer(url, function(cAndB) {
                    cAndB.source.playbackRate.value = config.tempo;
                    cAndB.source.connect(cAndB.context.destination);       // connect the source to the context's destination (the speakers)
                    cAndB.source.start(0);

                    if(which === 'left') {
                        $scope.leftAudio = cAndB;
                    }

                    if(which === 'right') {
                        $scope.rightAudio = cAndB;
                    }
                });
            }

            var playStreamLeft = function(url) {
                playStream(url, $scope.left.config, 'left');
            }

            var playStreamRight = function(url) {
                playStream(url, $scope.left.config, 'right');
            }

            // hacksss expose to window
            window.playNextLeft = function() {
                $scope.playNext($scope.left);
            };

            window.playNextRight = function() {
                $scope.playNext($scope.right);
            };


            // ===== MAY THE GODS OF SOFTWARE ENGINEERING ==== //
            // ===== HAVE MERCY ON MY SOUL ===== //
            // watch playing

            $scope.$watch(function() {
                return $scope.left.config.tempo;
            }, function(newVal, oldVal) {
                $scope.left.config.tempo = newVal;
                if($scope.leftAudio) {
                    $scope.leftAudio.source.playbackRate.value = $scope.left.config.tempo;
                }
            }, true);

            $scope.$watch(function() {
                return $scope.right.config.tempo;
            }, function(newVal, oldVal) {
                $scope.left.config.tempo = newVal;
                if($scope.rightAudio) {
                    $scope.rightAudio.source.playbackRate.value = $scope.left.config.tempo;
                }
            }, true);

            $scope.$watch(function() {
                return $scope.left.playing
            }, function(newVal, oldVal) {
                if(!oldVal && newVal) {
                    $scope.playNext($scope.left);
                    playStreamLeft($scope.left.playing.streamUrl, $scope.left.config);
                }
            }, true);
            
            $scope.$watch(function() {
                return $scope.right.playing;
            }, function(newVal, oldVal) {
                if(!oldVal && newVal) {
                    $scope.playNext($scope.right);
                    playStreamRight($scope.right.playing.streamUrl, $scope.right.config);
                }
            }, true);

            var addTrack = function(which, trackId) {
                SC.get('/tracks/' + trackId, function(res) {
                    if(res) {
                        var track = {
                            title: res.title,
                            artist: res.user.username,
                            streamUrl: res.stream_url + "?client_id=" + window.herditConfig.clientId,
                            scObj: res
                        };

                        which.tracks.push(track);
                        if(!which.playing) {
                            $scope.playNext(which);
                        }

                        $scope.$apply();
                    }
                });
            }

            $scope.apiConfig = {
                sc: window.herditConfig
            };

            window.addLeft = function() {
                addTrack($scope.left, 43227597);  
            }

            window.addRight = function() {
                addTrack($scope.right, 43227597);  
            }

            // ==== AUDIO STUFF ==== //
            function getAudioContextAndBuffer(url, callback) {
                var request = new XMLHttpRequest();
                request.open("GET", url, true);
                request.responseType = "arraybuffer";

                request.onload = function() {
                    var res = request.response;
                    var context = new (window.AudioContext || window.webkitAudioContext)();
                    var soundSource = context.createBufferSource();
                    var soundBuffer = context.createBuffer(res, true);
                    soundSource.buffer = soundBuffer;
                    callback({
                        context: context,
                        source: soundSource,
                        buffer: soundBuffer
                    });
                }

                request.send();
            }
            
        }

);