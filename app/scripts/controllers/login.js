'use strict';

/**
 * @ngdoc function
 * @name angularSampleApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the angularSampleApp
 */
angular.module('appBoot')
  .controller('LoginCtrl', function ($scope, $http, $modal, $log, $location, $window, authService, alerts) {

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

    $scope.facebookLogin = function() {
      $window.open(serverUrl + "/oauth2/authorization/facebook", "_blank",
        "height=700,width=700,status=yes,toolbar=no,menubar=no,location=no");
    }

    $scope.googleLogin = function() {
      $window.open(serverUrl + "/oauth2/authorization/google", "_blank",
        "height=700,width=700,status=yes,toolbar=no,menubar=no,location=no");
    }

    $window.socialLoginSuccess = function(id, nonce) {

      $http.post(serverUrl + '/api/core/login-with-nonce', {
        userId: id,
        nonce: nonce
      }).success(function (data, status, headers, config) {

          authService.changeUser(data);
          localStorage.setItem("authHeader", headers('Lemon-Authorization'));
          $modal.loginModalInstance.close();

      }).error(function (data, status, headers, config) {

          alerts.setKind('danger');
          alerts.addAlert("Invalid Nonce " + nonce + ". Please retry.");
          $modal.loginModalInstance.close();
      });
    }
  });
