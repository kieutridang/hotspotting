(function (angular, _) {
	'use strict';

	var controllers = angular.module('controllers');

	controllers.controller('EditTriggerController', function ($rootScope, $scope, $state, CampaignService, $uibModalInstance, triggerCampaign, PopupMessageService) {
		$scope.trigger = triggerCampaign;
		var tmpImg = $scope.trigger.image_url;
		$scope.trigger.validationImage = false;
		$scope.trigger.invalidImage = false;

		$scope.updateTriggerForm = {}
		$scope.fileNameChanged = function (file) {
			$timeout(function () {
				$scope.trigger.file_name = file.files[0].name;
			}, 100);
		}

		$scope.resizeImage = function() {
			PopupMessageService.showConfirmMessage("Are you sure you want to resize this image?", true, null, function () {
				var img = new Image();
		    img.onload = function(){
		        var canvas = document.createElement('canvas');
		        var ctx = canvas.getContext('2d');
						var ratio = 1;
						// var ratio = (640 / this.width) < (480 / this.height) ?  (640 / this.width) : (480 / this.height);
						if (this.width > this.height) {
						 if (this.height < 480) {
						     ratio = 480/this.height;
						 } else if (this.width < 640) {
						     ratio = 640/this.width;
						 }
						} else {
						 if (this.width < 480) {
						     ratio = 480/this.width;
						 } else if (this.height < 640) {
						     ratio = 640/this.height;
						 }
						}
						canvas.width = this.width * ratio;
		        canvas.height = this.height * ratio;
		        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
						if($scope.trigger) {
							$scope.trigger.image_url = canvas.toDataURL();
							$scope.trigger.validationImage = false;
							$scope.$apply();
							PopupMessageService.showAlertMessage('Resize image successfully!', true);
						} else {
							PopupMessageService.showAlertMessage('Resize image fail!', false);
						}
		    };
		    img.src = $scope.trigger.image_url;
				img.crossOrigin = 'Anonymous';
			});
		};

		$scope.updateTrigger = function (updateTriggerForm) {
			if (updateTriggerForm) {
				updateTriggerForm.isSubmitted = true;
				if (!updateTriggerForm.$valid) return;
			} else {
				updateTriggerForm = {};
			}

			var query = {
				triggerID: $scope.trigger.id,
				url: $scope.trigger.url,
				type: $scope.trigger.type,
				content: $scope.trigger.content,
				file_name: $scope.trigger.file_name || $scope.trigger.image
			};

			if ($scope.trigger.type == 'image') {
				if (tmpImg == $scope.trigger.image_url) {
					delete query.content;
					delete query.type;
				} else {
					query.content = $scope.trigger.image_url;
				}
			}

			$scope.isProcessing = true;
			CampaignService.updateTrigger(query).then(function (response) {
				$uibModalInstance.close(response);
				PopupMessageService.showAlertMessage("Edit successfull!", true);
				$scope.isProcessing = false;
			}, function (err) {
				$scope.isProcessing = false;
				PopupMessageService.showAlertMessage(err, false);
			});
		}

		$scope.closeModal = function () {
			$uibModalInstance.dismiss('cancel');
		}

		$scope.openImage = function(){
			$rootScope.$broadcast('openImage',
				{imgUrl: $scope.trigger.image_url, flag: true});
		}


	});


})(angular, _);
