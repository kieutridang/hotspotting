(function (angular, _) {
	'use strict';

	var directives = angular.module('directives');

	directives.directive('pageLeftbar', [function () {
		return {
			replace: true,
      restrict: "E",
			templateUrl: 'views/common/page-leftbar.html',
			controller: 'PageLeftbarController',
			link: function (scope, el, attr) {

			}
		};
	}]);

	directives.controller('PageLeftbarController', ['$scope', '$rootScope', '$http', '$window', '$state', function ($scope, $rootScope, $http, $window, $state) {

		$scope.signout = function () {
			$scope.$emit('logout');
		};

		$scope.goProfile = function () {
			$state.go("home.profile");
		};

		$scope.goSettings = function () {
			$state.go("home.settings");
		};
	}]);

})(angular, _);
