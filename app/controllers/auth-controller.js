(function (angular, _) {
	'use strict';

	var controllers = angular.module('controllers');

	controllers.controller('AuthController', function ($scope, $state, $stateParams, $rootScope, AuthService, UserService, appConfig) {
		$rootScope.settings.layout.isHidePageHeader = true;
		$rootScope.settings.layout.isSignInPage = true;

		$scope.$on('$destroy', function () {
			$rootScope.settings.layout.isHidePageHeader = false;
      $rootScope.settings.layout.isSignInPage = false;
		});
	});


})(angular, _);


