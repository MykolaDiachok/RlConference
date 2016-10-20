/**
 * Created by mikoladyachok on 12/10/2016.
 */

(function () {
    'use strict';
    var config = {
        apiKey: "AIzaSyBau95XDLSR9PSvHw983ZdSxkUF7K_39-E",
        authDomain: "rlconference-24f94.firebaseapp.com",
        databaseURL: "https://rlconference-24f94.firebaseio.com",
        storageBucket: "rlconference-24f94.appspot.com",
        messagingSenderId: "680539649493"
    };
    firebase.initializeApp(config);

    function ReturnEmptyObjectFireBase(data) {
        if (typeof(data) == 'undefined' || data === null) {
            return null;
        }
        return data;
    }

    function addLogins(userip) {
        var client = new ClientJS();
        var clientinfo = {
            IP: ReturnEmptyObjectFireBase(userip),
            OS: ReturnEmptyObjectFireBase(client.getOS()),
            OSVersion: ReturnEmptyObjectFireBase(client.getOSVersion()),
            UserAgent: ReturnEmptyObjectFireBase(client.getUserAgent()),
            Browser: ReturnEmptyObjectFireBase(client.getBrowser()),
            BrowserVersion: ReturnEmptyObjectFireBase(client.getBrowserVersion()),
            BrowserMajorVersion: ReturnEmptyObjectFireBase(client.getBrowserMajorVersion()),
            Device: ReturnEmptyObjectFireBase(client.getDevice()),
            DeviceType: ReturnEmptyObjectFireBase(client.getDeviceType()),
            DeviceVendor: ReturnEmptyObjectFireBase(client.getDeviceVendor()),
            CPU: ReturnEmptyObjectFireBase(client.getCPU()),
            TimeZone: ReturnEmptyObjectFireBase(client.getTimeZone()),
            Language: ReturnEmptyObjectFireBase(client.getLanguage()),
            SystemLanguage: ReturnEmptyObjectFireBase(client.getSystemLanguage()),
            currentResolution: ReturnEmptyObjectFireBase(client.getCurrentResolution())

        };
        return clientinfo;
    }



    angular
        .module('regapp', ['ui.mask', 'ngMessages', 'firebase'])

        .controller('UserRegCtrl', ['$scope', '$firebaseAuth', '$firebaseObject', '$firebaseArray', '$location', function ($scope, $firebaseAuth, $firebaseObject, $firebaseArray, $location) {
            //var userip = undefined;

            $scope.clientid = $location.search()['clientid'];
            $scope.dataid = $location.search()['dataid'];
            $scope.ref = firebase.database().ref();
            $scope.HideRegForm = false;
            $scope.authObj = $firebaseAuth();

            $scope.visibleCtrl = false;

            $scope.authObj.$signInAnonymously().then(function (firebaseUser) {
                console.log("Signed in as:", firebaseUser.uid);
                $scope.uid = firebaseUser.uid;
                $scope.visibleCtrl = true;

                //$(document).ready(function () {
                    $.getJSON("https://jsonip.com/?callback=?", function (data) {
                        console.log(data);
                        var clientinfo = addLogins(data.ip);

                        var tempdate = new Date();

                        var reffoo1 = $scope.ref.child("logins");
                        var userreginfo = {
                            clientid: ReturnEmptyObjectFireBase($scope.clientid),
                            dataid: ReturnEmptyObjectFireBase($scope.dataid)
                        };
                        var list = $firebaseArray(reffoo1);
                        list.$add(
                            {
                                DateTme: tempdate.toISOString(),
                                logid:ReturnEmptyObjectFireBase($scope.uid),
                                UserIdInfo: userreginfo,
                                UserInfo: clientinfo
                            }).then(function (ref) {
                            var id = ref.key;
                            console.log("added record with id " + id);
                            list.$indexFor(id); // returns location in the array
                        });
                    });
                //});

            }).catch(function (error) {
                console.error("Authentication failed:", error);
            });





            $scope.user = {};
            $scope.ph_numbr = /^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/;


            //const rootRef = firebase.database().ref().child('angular');
            //const ref = rootRef.child('object');



            // var arrayClients = $firebaseArray(firebase.database().ref().child("clients"));
            // var refclient = $firebaseObject(arrayClients);

            //var idCurClient = refclients.$indexFor($scope.clientid);


            var refpositions = $scope.ref.child("positions");
            $scope.positions = $firebaseArray(refpositions);


            $scope.RegSubmit = function () {
                var refreg = $scope.ref.child("registration");

                var listReg = $firebaseArray(refreg);
                listReg.$add(
                    {
                        clientid: $scope.clientid,
                        datetime: new Date().toISOString(),
                        dataid: $scope.dataid,
                        user: $scope.user
                    }).then(function (ref) {
                    var id = ref.key;
                    console.log("added reg user with id " + id);
                    listReg.$indexFor(id); // returns location in the array
                    $('#myModal').modal('show');
                },function (error) {
                    $('#myModalError').modal('show');
                    console.log("Error:"+ error.message);
                });

                //alert($scope.user.fullname);
            };

            $('#myModal').on('hidden.bs.modal', function (e) {
                console.log('Hide');
                $scope.visibleCtrl = false;
            });
            $('#myModalError').on('hidden.bs.modal', function (e) {
                console.log('Hide error');
                $scope.visibleCtrl = false;
            });

            $scope.HideForm = function () {
                console.log('Func Hide');
                //$scope.visibleCtrl = false;
                $scope.HideRegForm = true;
            };
            // console.log($scope.places);


        }]).config(function ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }).directive('selectpicker', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attributes) {
                $timeout(function () {
                    scope.$apply(function () {
                        element.selectpicker({
                            showSubtext: true
                        });
                    });
                })
            }
        }
    });


})();