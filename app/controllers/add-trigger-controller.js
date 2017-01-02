(function (angular, _) {
	'use strict';

	var controllers = angular.module('controllers');

	controllers.controller('AddTriggerController', function ($scope, $state, CampaignService, NewCampaignTriggerViewModel, $uibModalInstance, campaign, typeTrigger, PopupMessageService) {
		$scope.campaign = campaign;
		$scope.triggerItems = [];
		$scope.trigger = {
			campaignID: $scope.campaign.id,
			url: "",
			type: typeTrigger,
			content: "",
			file_name: "",
			image_url: ""
		};


		$scope.addTrigger = function (addTriggerForm) {
			addTriggerForm.$setSubmitted();
			if (!addTriggerForm.$valid) return;

			$scope.isProcessing = true;

			var paramTrigger  = {
				campaignID:  $scope.trigger.campaignID,
				url: $scope.trigger.url,
				content_list: JSON.stringify(_.pluck($scope.triggerItems, "contentBase64")),
				filename_list: JSON.stringify(_.pluck($scope.triggerItems, "fileName"))
			};

			CampaignService.createMultiTrigger(paramTrigger).then(function (respone) {
				$scope.isProcessing = false;
				if(respone.triggers.length > 0) {
					PopupMessageService.showAlertMessage("Create trigger successfully!", true);
				} else {
					PopupMessageService.showAlertMessage("Image can not be uploaded", false);
				}

				$uibModalInstance.close(respone);

			}, function (err) {
				$scope.isProcessing = false;
				PopupMessageService.showAlertMessage(err, false);
			});
		}

		$scope.closeModal = function () {
			$uibModalInstance.dismiss('cancel');
		}

		$scope.validationImage = false;
		$scope.invalidImage = false;
		$scope.isUpload = false;
		$scope.setFile = function (element) {
					$scope.isUpload = true;
					var image = new Image();
					var count = 0;
	        var files = element.files;
	        for(var i=0;i<files.length;i++)
	        {
	            var reader = new FileReader();
	            var currentFile = files[i];
				reader.onload = function (event) {
					image.src = event.target.result;

					var triggerItemModel = NewCampaignTriggerViewModel.getInstance();
					triggerItemModel.setImage(currentFile.name, currentFile.type, event.target.result);
					addTriggerItems(triggerItemModel);
					validaImg();
					$scope.$apply();
				};
				// when the file is read it triggers the onload event above.
				reader.readAsDataURL(files[i]);
	        }
		};

		$scope.resizeImage = function(trigger) {
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
						var index = $scope.triggerItems.indexOf(trigger);
						if(index >= 0) {
							$scope.triggerItems[index].content = canvas.toDataURL();
							$scope.triggerItems[index].contentBase64 = canvas.toDataURL();
							$scope.triggerItems[index].isScale = true;
							validaImg();
							$scope.$apply();
							PopupMessageService.showAlertMessage('Resize image successfully!', true);
						} else {
							PopupMessageService.showAlertMessage('Resize image fail!', false);
						}
		    };
		    img.src = trigger.content;
				img.crossOrigin = 'Anonymous';
			});
		};

		// add trigger items into the render list
		$scope.deleteTrigger = deleteTrigger;
		function deleteTrigger(triggerItem) {
			var idx = $scope.triggerItems.indexOf(triggerItem);
			if (idx >= 0) $scope.triggerItems.splice(idx, 1);
			validaImg();
		};

		// add trigger items into the render list
		var addTriggerItems = function (triggerItem) {
			$scope.triggerItems.unshift(triggerItem);
		};

		var validaImg = function(){
			//Trigger event onchange
			$("#uploadHelper").val("");
			var tempName = "";
			$scope.validationImage = false;
			$scope.invalidImage = false;
			var image = new Image();
			if($scope.triggerItems.length === 0) {
				$scope.isUpload = false;
				tempName = "NNo file select";
			} else {
				for(var i = 0; i < $scope.triggerItems.length; i++) {
					tempName += "," + $scope.triggerItems[i].fileName;
					image.src = $scope.triggerItems[i].content;
					$scope.triggerItems[i].validationImage = false;
					if(image.width === 0 && image.height === 0) {
						$scope.triggerItems[i].invalidImage = true;
						$scope.invalidImage = true;
						$scope.triggerItems[i].messageError="Invalid image. Please select again!";
					} else if((image.width < 640 || image.height < 480) && $scope.triggerItems[i].isScale !== true) {
						$scope.triggerItems[i].validationImage = true;
						$scope.validationImage = true;
						$scope.triggerItems[i].messageError="Size image is too small(640x480)";
					}
				}
			}
			$("#filenames").text(tempName.substr(1));
		}


	});



})(angular, _);
