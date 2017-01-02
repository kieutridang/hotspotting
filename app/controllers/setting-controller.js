(function (angular, _) {
	'use strict';

	var controllers = angular.module('controllers');

	controllers.controller('SettingsController', ['$rootScope', '$scope', '$timeout', '$uibModal', 'AuthService', 'PopupMessageService', 'UserService',
    function ($rootScope, $scope, $timeout, $uibModal, AuthService, PopupMessageService, UserService) {
    	$scope.userInfo = $scope.globals.userInfo;

    	$scope.editUserInfo = {};

    	$scope.toogleEditUserInfo = function () {
    		$scope.isEditUserInfo = !$scope.isEditUserInfo;

    		if ($scope.isEditUserInfo) {
    			$scope.editUserInfo.first_name = $scope.userInfo.first_name;
    			$scope.editUserInfo.last_name = $scope.userInfo.last_name;
    			$scope.editUserInfo.company = $scope.userInfo.company;
    		}
    	}

    	$scope.updateName = function (form) {
    		form.$setSubmitted();
    		if (!form.$valid) return;

    		$scope.isProcessing2 = true;
    		var query = {
    			first_name: $scope.editUserInfo.first_name,
    			last_name: $scope.editUserInfo.last_name,
    			company: $scope.editUserInfo.company
    		};

    		UserService.updateUser(query).then(function (result) {
    			AuthService.resetCurrentUser(result);
    			PopupMessageService.showAlertMessage("Update successful!", true);
    			$scope.isProcessing2 = false;

    			$scope.userInfo.first_name = $scope.editUserInfo.first_name;
    			$scope.userInfo.last_name = $scope.editUserInfo.last_name;
    			$scope.userInfo.company = $scope.editUserInfo.company;
    			$scope.isEditUserInfo = false;
    		}, function (err) {
    			$scope.isProcessing2 = false;
    			PopupMessageService.showAlertMessage(err, false);
    		});
    	}

    	$scope.updateProfile = function (form) {
    		form.$setSubmitted();
    		if (!form.$valid) return;

    		$scope.isProcessing = true;


    		var query = {
    			old_password: $scope.userInfo.old_password,
    			new_password: $scope.userInfo.new_password,
    			address: $scope.userInfo.address,
    			phone_number: $scope.userInfo.phone_number,
                profile_picture: $scope.userInfo.profile_picture,
                profile_picture_name: $scope.userInfo.profile_picture_name 
    		};

    		UserService.updateUser(query).then(function (result) {
    			AuthService.resetCurrentUser(result, query.new_password);

    			PopupMessageService.showAlertMessage("Update successful!", true);
    			$scope.isProcessing = false;
    		}, function (err) {
    			$scope.isProcessing = false;
    			PopupMessageService.showAlertMessage(err, false);
    		});
    	}

    }]);

    var directives = angular.module('directives');
    directives.directive('profileImage', [function () {
        return {
            restrict: "C",
            scope: {
                profile: "="
            },
            link: function (scope, element, attr) {
                var imageFile;
                element.on("change", function (event) {
                    var reader = new FileReader();
                    var imageFile = event.target.files[0];
                    reader.onload = function (e) {
                        scope.$apply(function () {
                            scope.profile['profile_picture'] = e.target.result;
                            scope.profile.profile_picture_name = imageFile.name;
                        })
                    };
                    reader.readAsDataURL(imageFile);
                    event.target.value = "";
                });
            }
        };
    }]);
})(angular, _);


