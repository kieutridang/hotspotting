(function (angular, _) {
	'use strict';

	var directives = angular.module('directives');

// Handle Dropdown Hover Plugin Integration
  directives.directive('dropdownMenuHover', function () {
    return {
      link: function (scope, elem) {
        elem.dropdownHover();
      }
    };
  });


})(angular, _);


