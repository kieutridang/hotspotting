(function (angular, _) {
	'use strict';

	var directives = angular.module('directives');

	directives.directive('pageQuickSidebar', [function () {
		return {
			replace: true,
      restrict: "E",
			templateUrl: 'views/common/page-quick-sidebar.html',
			link: function (scope, el, attr) {
        window.setTimeout(function(){
          QuickSidebar.init(); // init quick sidebar
        }, 2000);
			}
		};
	}]);


})(angular, _);


