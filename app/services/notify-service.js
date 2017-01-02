(function (angular,_){
	'use strict';

	angular.module('postMessage').factory('NotifyService', ['$log', '$http', '$q', 'Restangular', 'BaseService', function ($log, $http, $q, Restangular, BaseService) {
		var notification = Restangular.all('notification');

		function pushMessage(params){
			var deferred = $q.defer();
			var errorMessage = "";
			notification.one("push").customPOST(params).then(function (response) {
				if(response.status_code == 200){
					deferred.resolve(response.results);
				}
				else{
					deferred.reject(errorMessage);
				}
			}).catch(function(res){
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		}

		function NotifyService() {
			BaseService.call(this);
		}

		NotifyService.prototype = _.create(BaseService.prototype, {
			'constructor': BaseService,
			pushMessage: pushMessage
		});

		var service = new NotifyService;
		return service;
	}]);
})(angular,_);