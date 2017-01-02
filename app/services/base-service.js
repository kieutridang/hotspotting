(function (angular, _) {
	'use strict';

	var services = angular.module('services');

	services.factory('BaseService', ['$log', '$http', '$q', 'Restangular', 'appConfig', function ($log, $http, $q, Restangular, appConfig) {
		var BaseService = function () {
			this.apiUrl = appConfig.apiUrl;
			this.rootApiUrl = appConfig.baseApiUrl;
		}

		BaseService.prototype.getErrorMessages = function (result, defaultMessage) {
			var errorMessage = result.description || defaultMessage;
			return errorMessage;
		};

		return BaseService;
	}]);


})(angular, _);
