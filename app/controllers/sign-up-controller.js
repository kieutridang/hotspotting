(function (angular, _) {
	'use strict';

	var controllers = angular.module('controllers');

	controllers.controller('SignUpController', function ($scope, $rootScope, $state, $timeout, appConfig, AuthService, UserService, PopupMessageService) {
		$scope.user = {
			
		};

		$scope.publicKey = appConfig.recaptchaKey;

		$scope.register = function (signInForm) {
			signInForm.$setSubmitted();
			if (!signInForm.$valid) return;

			$scope.isProcessing = true;
			UserService.registerUser($scope.user).then(function (result) {
				//$scope.isProcessing = false;

				var user = {
					email: $scope.user.email,
					password: $scope.user.password
				};

				AuthService.login(user).then(function (result) {
					$scope.isProcessing = false;
				}, function (err) {
					$scope.isProcessing = false;
					PopupMessageService.showAlertMessage(err, false);
				});

				function goHomePage() {
					if ($scope.isProcessing) {
						$timeout(goHomePage, 500);
					} else {
						$state.go('home.dashboard');
					}
				}

				PopupMessageService.showAlertMessage('Please check your email to activate your account', true, null, goHomePage);
			}, function (err) {
				$scope.isProcessing = false;
				PopupMessageService.showAlertMessage(err, false);
			});
		}

		$scope.goSignIn = function () {
			$state.go('login.signIn');
		}
	});


})(angular, _);


