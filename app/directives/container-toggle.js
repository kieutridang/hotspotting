(function (angular, _) {
	'use strict';

	var directives = angular.module('directives');

	directives.directive('containerToggle', ['$rootScope', '$document', '$timeout', '$position', function ($rootScope, $document, $timeout, $position) {
		return {
			restrict: "A",
			priority: 1,
			scope: {
				isOpen: '=?',
			},
			link: function(scope, element, attrs) {
				element.addClass('toggle-container');
				scope.openClass = attrs.openClass || 'ng-hide';

				var prefix = "containerToggle";

				var appendToBody = angular.isDefined(attrs[prefix + 'AppendToBody']) ? scope.$eval(attrs[prefix + 'AppendToBody']) : false,
					parentSelector = attrs[prefix + 'ParentSelector'] || '',
					selector = attrs[prefix + 'Selector'] || '',

					positionStr = attrs[prefix + 'Placement'] || 'top-left',
					jqEl = $(element),
					jqParent;


				if (appendToBody) {
					jqParent = selector ?  $(selector) :  (parentSelector ? jqEl.closest(parentSelector) : jqEl.parent());

					$document.find('body').append(jqEl);
					jqEl.addClass('body-toggle-container');
				}

				var clickName = 'click.containerToggle';
				var documentClickBind = function (event) {
					//console.info('documentClickBind',event);

					if (scope.isOpen && !(element[0].contains(event.target))) {
						scope.$apply(function () {
							scope.isOpen = false;
						});
					}
				};

				scope.$watch('isOpen', function (value) {
					jqEl.toggleClass(scope.openClass, !value);

					if (value) {
						if (appendToBody) {
							var pos = $position.positionElements(jqParent, jqEl, positionStr, true);
							var css = {
								top: pos.top + 'px',
								display: value ? 'block' : 'none'
							};

							var rightAlign = jqEl.hasClass('toggle-container-right');
							if (!rightAlign) {
								css.left = pos.left + 'px';
								css.right = 'auto';
							} else {
								css.left = (pos.left -  jqEl.prop('offsetWidth')) + 'px';
								css.right = 'auto';
								//css.left = 'auto';
								//css.right = (window.innerWidth - (pos.left + jqEl.prop('offsetWidth'))) + 'px';
							}

							jqEl.css(css);

						}

						$timeout(function () {
							$document.bind(clickName, documentClickBind);
						}, 0, false);
					} else {
						$document.unbind(clickName, documentClickBind);
					}
				});

				scope.$on('$destroy', function () {
					if (scope.isOpen === true) {
						if (!$rootScope.$$phase) {
							scope.$apply(function () {
								scope.isOpen = false;
							});
						}
					}

					if (appendToBody) {
						jqEl.remove();
					}

					$document.unbind(clickName, documentClickBind);
				});
			}
		};
	}]);

	


})(angular, _);