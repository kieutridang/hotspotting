(function (angular, _) {
	'use strict';

	var services = angular.module('services');

	services.factory('BrandService', function ( $q, Restangular, BaseService,BrandModel) {
		var brands = Restangular.all('brand');


		function getBrandList(param) {
			var deferred = $q.defer();
			var errorMessage = "Can't brand list. Please try again.";

			brands.one("list").customPOST(param).then(function (result) {
				if (result.status_code == 200) {
					var brands = _.map(result.brand, function (data) {
						return BrandModel.getInstance().setData(data);
					});

					deferred.resolve(brands);
				} else {
					errorMessage = result.message || errorMessage;
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				//debugger;
				var  data= res.data;
				errorMessage = data.message || errorMessage;
				deferred.reject(errorMessage);
			});

			return deferred.promise;
		}

		function BrandService() {
			BaseService.call(this);
		}

		BrandService.prototype = _.create(BaseService.prototype, {
			'constructor': BaseService,

			getList: getBrandList,
		});

		var service = new BrandService;
		return service;
	});



})(angular, _);


