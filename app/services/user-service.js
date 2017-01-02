(function (angular, _) {
	'use strict';

	var services = angular.module('services');

	services.factory('UserService', ['$log', '$http', '$q', 'Restangular', 'BaseService', function ($log, $http, $q, Restangular, BaseService) {
		var users = Restangular.all('user');

		function registerUser(model) {
			var deferred = $q.defer();
			var errorMessage = "Can't register user. Please try again.";

			var registerModel = {
				email: model.email,
				password: model.password,
				first_name: model.firstName,
				last_name: model.lastName,
				company: model.company,
			};

			users.one("register")
				.withHttpConfig({ noIdentity: true})
				.customPOST(registerModel).then(function (result) {
				if (result.status_code == 200) {
					var userInfo = result.user;
					deferred.resolve(userInfo);
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

		function updateUser(params) {
			var deferred = $q.defer();
			var errorMessage = "Can't update user. Please try again.";

			users.one("edit").post("", params).then(function (result) {
				if (result.status_code == 200) {
					var userInfo = result.user;
					deferred.resolve(userInfo);
				} else {
					errorMessage = result.message || errorMessage;
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				var data = res.data;
				errorMessage = data.message || errorMessage;
				deferred.reject(errorMessage);
			});

			return deferred.promise;
		}

		function UserService() {
			BaseService.call(this);
		}

		UserService.prototype = _.create(BaseService.prototype, {
			'constructor': BaseService,

			registerUser: registerUser,
			updateUser: updateUser
		});

		var service = new UserService;
		return service;
	}]);



})(angular, _);


