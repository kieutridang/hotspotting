(function (angular, _) {
	'use strict';

	var controllers = angular.module('controllers');

	controllers.controller('AppController', function ($scope, $state, $stateParams, $rootScope) {

    $scope.$on('$viewContentLoaded', function() {
      //App.initComponents(); // init core components
      //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive
    });

	});


})(angular, _);


