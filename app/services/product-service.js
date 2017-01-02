(function (angular, _) {
	'use strict';

	var services = angular.module('services');

	services.factory('ProductService', ['$log', '$http', '$q', 'Restangular', 'BaseService',
		function ($log, $http, $q, Restangular, BaseService) {
		// var API_PRODUCT_LIST = 'product/list';
		// var API_PRODUCT_CREATE = 'product/create';
		// var API_PRODUCT_EDIT = 'product/edit';
		// var API_PRODUCT_DELETE = 'product/delete';
		// var API_PRODUCT_ASSOCIATE = 'product/associate_to_campaign';

		function getProducts(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			Restangular.all("product/list").post(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result.product);
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

		function createFeature(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			Restangular.all("feature/create").post(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result);
				}
				else {
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				errorMessage = this.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});


			return deferred.promise;
		}

		function listFeature(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			Restangular.all("feature/list").post(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result);
				}
				else {
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				errorMessage = this.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});


			return deferred.promise;
		}

		function editFeature(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			Restangular.all("feature/edit").post(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result);
				}
				else {
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				errorMessage = this.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});


			return deferred.promise;
		}


		function getProductsFromCMS(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			params.url = "http://staging.hotspotting.com/api/v1/products?search=" + params.search + "&brand_search=" + params.brand_search + "&per=" + params.page_per;
			params.type = "GET";

			Restangular.all("wrapper/get_data").customPOST(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result.data);
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

		function createProduct(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			Restangular.all("product/create").post(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result);
				}
				else {
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				errorMessage = this.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});


			return deferred.promise;
		}

		function editProduct(params) {
			var deferred = $q.defer();
			var errorMessage = "";


			Restangular.all("product/edit").post(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result);
				}
				else {
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				errorMessage = this.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});


			return deferred.promise;
		}

		function deleteProduct(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			//errorMessage = this.getErrorMessages(res, errorMessage);
			Restangular.all("product/delete").post(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result);
				}
				else {
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				errorMessage = this.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});


			return deferred.promise;
		}


		function associateProduct(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			Restangular.all("product/associate_to_campaign").post(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result);
				}
				else {
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				errorMessage = this.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});


			return deferred.promise;
		}


		function associateTriggerProduct(params) {
			var deferred = $q.defer();
			var errorMessage = "";

			Restangular.all("product/associate_to_trigger").post(params).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result);
				}
				else {
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				deferred.reject(res);
			});
			return deferred.promise;
		}

		function ProductService() {
			BaseService.call(this);
		}

		ProductService.prototype = _.create(BaseService.prototype, {
			'constructor': BaseService,

			getProducts: getProducts,
			createProduct: createProduct,
			editProduct: editProduct,
			deleteProduct: deleteProduct,
			associateProduct: associateProduct,
			associateTriggerProduct: associateTriggerProduct,
			getProductsFromCMS: getProductsFromCMS,
			createFeature: createFeature,
			listFeature: listFeature,
			editFeature: editFeature

		});

		var service = new ProductService;
		return service;
	}]);



})(angular, _);
