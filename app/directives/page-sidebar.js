(function (angular, _) {
	'use strict';

	var directives = angular.module('directives');

	directives.directive('pageSidebar', [function () {
		return {
			replace: true,
      restrict: "E",
			templateUrl: 'views/common/page-sidebar.html',
			link: function (scope, el, attr) {
        Layout.initSidebar(); // init sidebar
			}
		};
	}]);


})(angular, _);


