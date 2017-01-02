(function (angular, _) {
	'use strict';

	var directives = angular.module('directives');

	directives.directive('pageHeader', [function () {
		return {
			replace: true,
      restrict: "E",
			templateUrl: 'views/common/page-header.html',
			controller: 'PageHeaderController',
			link: function (scope, el, attr) {
        Layout.initHeader(); // init header
			}
		};
	}]);

	directives.controller('PageHeaderController', ['$scope', '$rootScope', '$http', '$window', '$state', function ($scope, $rootScope, $http, $window, $state) {
		$scope.signOut = function () {
			$scope.$emit('logOut');
		};

		$scope.goProfile = function () {
			$state.go("home.profile");
		};

		$scope.goSettings = function () {
			$state.go("home.settings");
		};
	}]);

})(angular, _);
