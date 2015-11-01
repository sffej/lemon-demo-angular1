'use strict';

/**
 * @ngdoc function
 * @name angularSampleApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the angularSampleApp
 */
angular.module('appBoot')
  .controller('LoginCtrl', function ($scope, $http, $modal, $log, $location, authService) {

    $scope.credentials = {
      username: '',
      password: '',
      rememberMe: false
    };

    $scope.errors = [];

    $scope.login = function () {

      $http
        .post(serverUrl + '/login', $.param($scope.credentials), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        })
        .then(function (data) {
          authService.changeUser(data.data);
          $modal.loginModalInstance.close();
        }, function (data) {
          authService.changeUser(null);
          $scope.errors[0] = data.data.message;
          $log.warn(JSON.stringify(data));
        });
    };

    $scope.cancel = function() {
      $modal.loginModalInstance.dismiss('cancel');
    };

    $scope.forgotPassword = function() {
      $location.url("/forgot-password");
      $scope.cancel();
    };

  });