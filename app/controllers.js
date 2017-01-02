(function (angular) {
	"use strict";

	var controllers = angular.module('controllers', [
		'services',
		'filters',
		'models',
		"ui.bootstrap",
		'ngStorage',
		'angularFileUpload',
		'vcRecaptcha'
	]);

	var moduleModule = angular.module('campaignModule',['ui.bootstrap']);
	var productModule = angular.module('productModule',[]);
	var dashboardModule = angular.module('dashboardModule',[]);
	var postMessage = angular.module('postMessage',[]);
	var feedModule = angular.module('feedModule',[]);

})(angular);
