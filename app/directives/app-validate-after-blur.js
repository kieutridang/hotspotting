(function (angular) {
	'use strict';

	var directives = angular.module('directives');

	directives.directive('ngFocus', [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                ctrl.$focused = false;
                element.bind('focus', function (evt) {
                    //element.addClass(FOCUS_CLASS);
                    scope.$apply(function () { ctrl.$focused = true; });
                }).bind('blur', function (evt) {
                    scope.$apply(function () { ctrl.$focused = false; });
                });

                scope.$watch(ctrl.$focused, function (n) {
                    ctrl.$setValidity("checkblur", n);
                });
            }
        }
    }]);

})(angular);