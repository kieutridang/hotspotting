(function (angular, _) {
	'use strict';

	var services = angular.module('services');

	services.factory('OrderService', ['$log', '$http', '$q', 'Restangular', 'BaseService',
		function ($log, $http, $q, Restangular, BaseService) {

		function getOrders(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			Restangular.all("order/list").post(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result.orders);
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

		function updateOrder(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			Restangular.all("order/update").post(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result.orders);
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

		function getOrderAnaylytics(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			Restangular.all("order/sale_analytics").post(params).then(function (result) {
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

		function OrderService() {
			BaseService.call(this);
		}

		OrderService.prototype = _.create(BaseService.prototype, {
			'constructor': BaseService,

			getOrders: getOrders,
			updateOrder: updateOrder,
			getOrderAnaylytics: getOrderAnaylytics

		});

		var service = new OrderService;
		return service;
	}]);



})(angular, _);
