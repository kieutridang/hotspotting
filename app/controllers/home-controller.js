(function (angular, _) {
	'use strict';

	var controllers = angular.module('controllers');

	controllers.controller('HomeController', function ($scope, $state, $stateParams, $rootScope) {
		$state.go('home.dashboard');
	});


})(angular, _);


