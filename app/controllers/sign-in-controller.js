(function (angular, _) {
	'use strict';

	var controllers = angular.module('controllers');

	controllers.controller('SignInController', function ($scope, $rootScope, $state, appConfig, AuthService, PopupMessageService) {
		// $scope.user = {
		// 	email: appConfig.login.defaultUsername,
		// 	password: appConfig.login.defaultPassword,
		// };

		$scope.login = function(signUpForm) {
			signUpForm.$setSubmitted();
			if (!signUpForm.$valid) return;

			$scope.isProcessing = true;
			AuthService.login({email: $scope.user.email, password: $scope.user.password}).then(function (response) {
				$scope.isProcessing = false;
				$state.go('home.dashboard');
			}, function (err) {
				$scope.isProcessing = false;
				PopupMessageService.showAlertMessage(err, false);
			});
		};

		$scope.goSignUp = function() {
			$state.go('login.signUp');
		};
	});


	controllers.controller('SignInControllerAuto', function ($scope, $rootScope, $state, appConfig, AuthService, PopupMessageService, $translate) {
		var user = {
			email: 'hotspottingv3@ulab.com',
			password: '12345678'
		};

		AuthService.login(user).then(function (response) {

			//$('body').addClass("fixed-layout-header");
			if($state.params.hideHeader === "true") {
				$('body').addClass("fixed-layout-header");
			}
			if($state.params.hideLeftBar === "true") {
				$('body').addClass("fixed-layout-bar");
			}
			if($state.params.section === 'dashboard') {
				$state.go('home.dashboard');
			} else if($state.params.section === 'campaign') {
				$state.go('home.accounts');
			} else if ($state.params.section === 'report') {
				$state.go('home.analytics');
			} else if ($state.params.section === 'orderHistory') {
				$state.go('home.orderHistory');
			}

			var locale = $state.params.locale;
			if (!locale) {
                locale = 'en';
            }

            $translate.use(locale);
		}, function (err) {
			$scope.isProcessing = false;
			PopupMessageService.showAlertMessage(err, false);
		});
	});


})(angular, _);
