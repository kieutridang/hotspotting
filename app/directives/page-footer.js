(function (angular, _) {
	'use strict';

	var directives = angular.module('directives');

	directives.directive('pageFooter', [function () {
		return {
			replace: true,
      restrict: "E",
			templateUrl: 'views/common/page-header.html',
			link: function (scope, el, attr) {
				Layout.initFooter(); // init footer
			}
		};
	}]);


})(angular, _);


