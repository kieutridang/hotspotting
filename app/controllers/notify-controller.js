(function (angular,_){
	'use strict';

	angular.module('postMessage').controller('NotificationController',['$rootScope', '$window', '$scope', '$state', '$interval', '$timeout', '$uibModal', '$filter', 'PopupMessageService', 'appConfig', 'localStorageService','NotifyService',
	function ($rootScope,$window,$scope,$state,$interval,$timeout,$uibModal,$filter,PopupMessageService,appConfig,localStorageService, NotifyService){
		$scope.message = '';
		$scope.success = true;
		$scope.SendButton = "Send";
		var params = {};
		$scope.pushmessage = function(){
			params.message = $scope.message;
			$scope.SendButton = "Sending";
			NotifyService.pushMessage(params).then(function() {
			   PopupMessageService.showAlertMessage("Push message successful", true);
			   $scope.message = '';
			   $scope.SendButton = "Send";
			}, function() {
			   console.log("There was an error send");
				 PopupMessageService.showAlertMessage("Push message fail!", false);
			});
		};
	}]);
})(angular,_);
