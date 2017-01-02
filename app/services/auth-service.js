(function () {
	'use strict';

	var module = angular.module('app');


})();

(function (angular, _) {
	'use strict';

	var services = angular.module('services');

	var currentUser = null;

	services.factory('AuthService', function ($http, $cookies, $rootScope, $timeout, UserService, appConfig, $q, Restangular) {
		var baseApiUrl = appConfig.authApiUrl;
		var COOKIE_NAME = appConfig.cookieName;

		var tokens = Restangular.all('/');
		var users = Restangular.all('user');

		var tokenInfo = null;

		function getToken() {
			var deferred = $q.defer();
			// if (tokenInfo) {
			// 	deferred.resolve(tokenInfo);
			// 	return deferred.promise;
			// }

			delete $http.defaults.headers.common['Authorization'];
			var errorMessage = "Can't login. Please try again.";

			var data = {
				client_id: appConfig.login.clientId,
				client_secret: appConfig.login.secret,
				grant_type: "client_credentials",
				scope: "client_access",
			}

			tokens.one("oauth2")
				.withHttpConfig({ noIdentity: true })
				.customPOST(data).then(function (result) {
				if (result.status_code == 200){
					tokenInfo = {
						token_type: result.token_type,
						expires_in: result.expires_in,
						access_token: result.access_token
					};

					setAuthorizationHeader(tokenInfo.access_token, tokenInfo.token_type)
					deferred.resolve(tokenInfo);
				} else {
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				deferred.reject(errorMessage);
			});

			return deferred.promise;
		}

		function setAuthorizationHeader(accessToken,tokenType) {
			 var authorizationHeader = tokenType + ' ' + accessToken;
			$http.defaults.headers.common['Authorization'] = authorizationHeader;
		}

		function login(model) {
			var deferred = $q.defer();
			//delete $http.defaults.headers.common['Authorization'];
			var errorMessage = "Can't login. Please try again.";

			var data = {
				email: model.email,
				password: model.password,
			}

			getToken().then(function (tokenInfo) {
				users.one("login")
					.withHttpConfig({ noIdentity: true })
					.customPOST(data).then(function (result) {
					if (result.status_code == 200) {
						var userInfo = result.user;

						data.userInfo = userInfo;
						data.tokenInfo = tokenInfo;
						setCredentials(data, false);

						deferred.resolve(userInfo);
						//tokens.one('brand/list').post();
					} else {
						deferred.reject(errorMessage);
					}
				}).catch(function (res) {
					deferred.reject(errorMessage);
				});
			});

			return deferred.promise;
		}

		function setCredentials(data, rememberMe) {
			var expiresIn = data.tokenInfo['expires_in'],
				now = new Date();

			var cookieOptions = {
				//path
				//domain
				//secure: true,
				expireTime: now
			};

			if (!!rememberMe) {
				now.setSeconds(now.getSeconds() + expiresIn);
				cookieOptions.expires = now;
			}

			currentUser = data;
			$rootScope.globals.isAuthenticated = true;
			$rootScope.globals.userInfo = data.userInfo;

			setDefaultHeaders(currentUser);
			$cookies.putObject(COOKIE_NAME, currentUser, cookieOptions);
		}

		function clearCredentials() {
			$rootScope.globals.isAuthenticated = false;
			currentUser = null;
			$cookies.remove(COOKIE_NAME);
			//delete $http.defaults.headers.common['Authorization'];
		}

		function setDefaultHeaders(currentUser) {
			if (currentUser.tokenInfo.access_token) {
				var authorizationHeader = 'Bearer ' + currentUser.tokenInfo.access_token;
				$http.defaults.headers.common['Authorization'] = authorizationHeader;
			}
		}

		function getCurrentUser() {
			return { email: currentUser.email, password: currentUser.password };
		}

		function resetCurrentUser(userInfo, newPassword) {
			var cookieOptions = {
				expireTime: new Date()
			};

			if (newPassword)
				currentUser.password = newPassword;
			currentUser.userInfo = userInfo;
			$rootScope.globals.userInfo = userInfo;

			$cookies.putObject(COOKIE_NAME, currentUser, cookieOptions);
		}

		function init() {
			$http.defaults.headers.common['Accept'] = 'application/vnd.ulab.v0+json';
			currentUser = $cookies.getObject(COOKIE_NAME);

			console.info(currentUser)
			$rootScope.globals = {
				isAuthenticated: !!currentUser,
			};

			if (currentUser) {
				setDefaultHeaders(currentUser);
				$rootScope.globals.userInfo = currentUser.userInfo;
			} else {
				getToken();
			}

			//tokens.one('brand/list').post();
		}

		var service = {
			init: init,
			login: login,
			setCredentials: setCredentials,
			clearCredentials: clearCredentials,
			getCurrentUser: getCurrentUser,
			resetCurrentUser: resetCurrentUser
		};

		return service;
	});

	services.factory('bearerTokenInterceptor', ['$log', '$q', '$location', function ($log, $q, $location) {
		//$log.debug('$log is here to show you that this is a regular factory with injection');

		var bearerTokenInterceptor = {
			'request': function (config) {
				//console.info(config);
				if (config.method === "POST" && !config.noIdentity) {
					if (currentUser) {
						config.data = _.assign(config.data, { email: currentUser.email, password: currentUser.password });
					}
				}

				return config;
			},
			'responseError': function (response) {
				if (response.status === 401) {
					$location.path('/login');
				}

				return $q.reject(response);
			}
		};

		return bearerTokenInterceptor;
	}]);


})(angular, _);
