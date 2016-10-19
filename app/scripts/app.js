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

    function ReturnEmptyObjectFireBase(data)
    {
        if(typeof(data) == 'undefined' || data === null)
        {
            return 'none';
        }
        return data;
    }

    angular
        .module('regapp', ['ui.mask', 'ngMessages', 'firebase'])

        .controller('UserRegCtrl', ['$scope', '$firebaseAuth', '$firebaseObject', '$firebaseArray', '$location', function ($scope, $firebaseAuth, $firebaseObject, $firebaseArray, $location) {

            var client = new ClientJS();
            var clientinfo = {
                OS:ReturnEmptyObjectFireBase(client.getOS()),
                OSVersion:ReturnEmptyObjectFireBase(client.getOSVersion()),
                UserAgent:ReturnEmptyObjectFireBase(client.getUserAgent()),
                Browser:ReturnEmptyObjectFireBase(client.getBrowser()),
                BrowserVersion:ReturnEmptyObjectFireBase(client.getBrowserVersion()),
                BrowserMajorVersion:ReturnEmptyObjectFireBase(client.getBrowserMajorVersion()),
                Device:ReturnEmptyObjectFireBase(client.getDevice()),
                DeviceType:ReturnEmptyObjectFireBase(client.getDeviceType()),
                DeviceVendor:ReturnEmptyObjectFireBase(client.getDeviceVendor()),
                CPU:ReturnEmptyObjectFireBase(client.getCPU()),
                TimeZone:ReturnEmptyObjectFireBase(client.getTimeZone()),
                Language:ReturnEmptyObjectFireBase(client.getLanguage()),
                SystemLanguage:ReturnEmptyObjectFireBase(client.getSystemLanguage())

        };
            console.log(client.getBrowser());
            console.log(client);

            $scope.user = {};
            $scope.ph_numbr = /^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/;
            $scope.clientid = $location.search()['clientid'];
            $scope.dataid = $location.search()['dataid'];
            var tempdate = new Date();
            $scope.ref = firebase.database().ref();
            var reffoo1 = $scope.ref.child("logins");
            var userreginfo = {
                clientid:ReturnEmptyObjectFireBase($scope.clientid),
                dataid:ReturnEmptyObjectFireBase($scope.dataid)
            };
            var list = $firebaseArray(reffoo1);
            list.$add(
                {
                    DateTme:tempdate.toISOString(),
                    UserIdInfo:userreginfo,
                    UserInfo:clientinfo
                }).then(function(ref) {
                var id = ref.key;
                console.log("added record with id " + id);
                list.$indexFor(id); // returns location in the array
            });



            //const rootRef = firebase.database().ref().child('angular');
            //const ref = rootRef.child('object');

            $scope.authObj = $firebaseAuth();

            $scope.authObj.$signInAnonymously().then(function (firebaseUser) {
                console.log("Signed in as:", firebaseUser.uid);
                $scope.uid = firebaseUser.uid;
            }).catch(function (error) {
                console.error("Authentication failed:", error);
            });

            // var arrayClients = $firebaseArray(firebase.database().ref().child("clients"));
            // var refclient = $firebaseObject(arrayClients);
            $scope.visibleCtrl = true;
            //var idCurClient = refclients.$indexFor($scope.clientid);


            var refpositions = $scope.ref.child("positions");
            $scope.positions = $firebaseArray(refpositions);





            $scope.RegSubmit = function () {
                var refreg = $scope.ref.child("registration");

                var listReg = $firebaseArray(refreg);
                listReg.$add(
                    {
                        clientid:$scope.clientid,
                        datetime:tempdate.toISOString(),
                        dataid:$scope.dataid,
                        user:$scope.user
                    }).then(function(ref) {
                    var id = ref.key;
                    console.log("added reg user with id " + id);
                    listReg.$indexFor(id); // returns location in the array
                });
                    //alert($scope.user.fullname);
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