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



    angular
        .module('regapp', ['ui.mask', 'ngMessages', 'ngMaterial', 'firebase'])

        .factory('Auth', ['$firebaseAuth',
            function ($firebaseAuth) {
                return $firebaseAuth();
            }])
        .factory('Places',['$firebaseArray',function ($firebaseArray) {
            var refPlaces = firebase.database().ref().child('Places');
            // $scope.places = $firebaseArray(refPlaces);
            return $firebaseArray(refPlaces);
        }])
        .controller('UserRegCtrl', ['$scope', '$firebaseAuth', '$firebaseObject', '$firebaseArray', '$location', 'Places', function ($scope, $firebaseAuth, $firebaseObject, $firebaseArray, $location,Places) {

            $scope.ph_numbr = /^(\+?(\d{1}|\d{2}|\d{3})[- ]?)?\d{3}[- ]?\d{3}[- ]?\d{4}$/;
            $scope.clientid = $location.search()['clientid'];

            //const rootRef = firebase.database().ref().child('angular');
            //const ref = rootRef.child('object');

            $scope.authObj = $firebaseAuth();

            $scope.authObj.$signInAnonymously().then(function (firebaseUser) {
                console.log("Signed in as:", firebaseUser.uid);
                $scope.uid = firebaseUser.uid;
            }).catch(function (error) {
                console.error("Authentication failed:", error);
            });

            var arrayClients = firebase.database().ref().child("clients");
            var refclients = $firebaseArray(arrayClients);
            $scope.visibleCtrl = true;
            var idCurClient = refclients.$indexFor($scope.clientid);


            var refpositions = firebase.database().ref().child("positions");
            $scope.positions = $firebaseArray(refpositions);

            $scope.selectedplace=undefined;
            $scope.places = Places;

            console.log($scope.places);


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