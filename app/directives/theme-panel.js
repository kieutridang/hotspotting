(function (angular, _) {
	'use strict';

	var directives = angular.module('directives');

	directives.directive('themePanel', [function () {
		return {
			replace: true,
      restrict: "E",
			templateUrl: 'views/common/theme-panel.html',
			link: function (scope, el, attr) {
        Demo.init(); // init theme panel
			}
		};
	}]);


})(angular, _);


