(function (angular, _) {
	'use strict';

	var models = angular.module('models');

	models.factory('BaseViewModel', function () {
		function BaseViewModel() {
			var $this = this;
			return $this;
		}

		/*
		Prototype define here
		 */
		/**
		 * Inject ourself to subClass so that subClass will inherit BaseViewModel
		 * @param subClass
		 */
		BaseViewModel.prototype.toBaseClass = function (subClass) {
			subClass = subClass || {};
			subClass.prototype = subClass.prototype || {};
			angular.extend(subClass.prototype, BaseViewModel.prototype);
			// this function will not be inherited
			delete subClass.prototype.toBaseClass;
		};

		/**
		 * Set controller $scope
		 * @param scope
		 */
		BaseViewModel.prototype.setScope = function (scope) {
			this.$scope = scope;
		};

		return new BaseViewModel();
		/*return {
		  /!**
		   * Get new instance of BaseViewModel
		   * @param $scope
		   * @returns {BaseViewModel}
		   *!/
		  getInstance: function () {
			return new BaseViewModel();
		  }
		};*/
	});

})(angular, _);


