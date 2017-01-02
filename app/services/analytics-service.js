(function (angular, _) {
	'use strict';

	var services = angular.module('services');

	services.factory('AnalyticsService', ['$log', '$http', '$q', 'Restangular', 'BaseService', 
		function ($log, $http, $q, Restangular, BaseService) {

		function getQueryList(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			Restangular.all("query/list").post(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result);
				}
				else {
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				//errorMessage = this.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});
			

			return deferred.promise;
		}

		function getAnalytics(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			Restangular.all("query/analytic").post(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result.results);
				}
				else {
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				//errorMessage = this.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});
			

			return deferred.promise;
		}

		function getEngagements(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			Restangular.all("query/localytics").post(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result);
				}
				else {
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				//errorMessage = this.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});
			

			return deferred.promise;
		}

		function getApps(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			Restangular.all("query/list_app").post(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result);
				}
				else {
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				//errorMessage = this.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});
			

			return deferred.promise;
		}


		function AnalyticsService() {
			BaseService.call(this);
		}

		AnalyticsService.prototype = _.create(BaseService.prototype, {
			'constructor': BaseService,

			getQueryList: getQueryList,
			getApps: getApps,
			getEngagements: getEngagements,
			getAnalytics: getAnalytics
		});

		var service = new AnalyticsService;
		return service;
	}]);



})(angular, _);


