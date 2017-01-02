(function (angular, _) {
	'use strict';

	var controllers = angular.module('controllers');

	controllers.controller('AddImageCampaignController', function ($scope, $sce, $state, $stateParams,
		$http, $timeout, $uibModal, NewCampaignTriggerViewModel, CampaignService, PopupMessageService) {
		$scope.brandId = parseInt($stateParams.brandId);
		var wtriggers = [];
		var countSuccess = 0;
		var countError = 0;


		$scope.model = {
			title: '',
			url: '',
			fullURL: '',
			isUrlValid: true,
			isUrlChecking: false,
			canShowTriggerBox: false
		};

		$scope.trustSrc = function (src) {
			return $sce.trustAsResourceUrl(src);
		}

		$scope.triggerItems = [];

		var showUrlCheckingAnimation = function () {
			$timeout(function () {
				$scope.model.isUrlChecking = true;
			}, 1)
		};

		var hideUrlCheckingAnimation = function () {
			$timeout(function () {
				$scope.model.isUrlChecking = false;
			}, 1)
		};

		var decideTogoStep2 = function () {
			if ($scope.model.title && $scope.model.url && $scope.model.isUrlValid) {
				// can go to step 2
				$scope.model.canShowTriggerBox = true;
				$scope.model.fullURL = '' + $scope.model.url;

			}
			else {
				// stay in step 1
				$scope.model.canShowTriggerBox = false;
			}
		};

		// add trigger items into the render list
		var addTriggerItems = function (triggerItem) {
			$scope.triggerItems.unshift(triggerItem);
			decideTogoStep2();
		};


		// add trigger items into the render list
		$scope.deleteTrigger = deleteTrigger;
		function deleteTrigger(triggerItem) {
			var idx = $scope.triggerItems.indexOf(triggerItem);
			if (idx >= 0) $scope.triggerItems.splice(idx, 1);
			validaImg();

			//Trigger event onchange
			$("#uploadHelper").val("");
		};

		/**
		 * Get available trigger list except the exceptId which has been submited to Campaign
		 * @param exceptId
		 */
		var getAvailableTriggerListExceptCampaign = function (exceptId) {
			var ret = [];
			$scope.triggerItems.forEach(function (x) {
				if (x.id == exceptId) {
					ret.push(x);
				}
			});
			return ret;
		};

		/// get first trigger images in list
		var getFirstTriggerImage = function () {
			var ret = null;
			$scope.triggerItems.forEach(function (x) {
				if (ret == null && x.type == 'image') {
					ret = x;
				}
			});
			return ret;
		};

		$scope.onCampaignDetailTitleChange = function () {
			decideTogoStep2();
		};

		$scope.checkInputUrl = function () {
			$timeout(function () {
				showUrlCheckingAnimation();
				//var url = 'https://query.yahooapis.com/v1/public/yql?q=select * from html where url="' + $scope.model.url + '"&format=json';
				// var endCodeUrl = encodeURIComponent($scope.model.url);
				// var url = "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D%22" + endCodeUrl +"%22&format=json'&callback=?";

				// $.getJSON(url, function (data) {
				// 	if (data.results.length) {
				// 		$scope.model.isUrlValid = true;
				// 	} else {
				// 		$scope.model.isUrlValid = false;
				// 	}

				// 	hideUrlCheckingAnimation();
				// 	decideTogoStep2();
				// }, function (er) {
				// 	hideUrlCheckingAnimation();
				// 	decideTogoStep2();
				// });
				$timeout(function() {
					$scope.model.isUrlValid = true;
					hideUrlCheckingAnimation();
					decideTogoStep2();
				}, 1000);

			}, 100);
		};
		$scope.canSubmit = false;
		$scope.validationImage = false;
		$scope.setFile = function (element) {
					$scope.canSubmit = true;
	        var files = element.files;
	        for(var i=0;i<files.length;i++)
	        {
            var reader = new FileReader();
            var currentFile = files[i];
						reader.onload = function (event) {
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
							PopupMessageService.showAlertMessage("Resize image successfully!", true);
						} else {
							PopupMessageService.showAlertMessage("Resize image fail!", false);
						}
		    };
		    img.src = trigger.content;
				img.crossOrigin = 'Anonymous';
			});
		};

		$scope.invalidImage = false;
		var validaImg = function(){
			var image = new Image();
			$scope.validationImage = false;
			$scope.invalidImage = false;
			if($scope.triggerItems.length === 0) {
				$scope.canSubmit = false;
			} else {
				for(var i = 0; i < $scope.triggerItems.length; i++) {
					image.src = $scope.triggerItems[i].content;
					$scope.triggerItems[i].validationImage = false;
					$scope.triggerItems[i].invalidImage = false;
					if(image.width === 0 && image.height === 0) {
						$scope.triggerItems[i].invalidImage = true;
						$scope.invalidImage = true;
						$scope.triggerItems[i].messageError="Invalid image. Please select again!";
					} else if((image.width < 640 || image.height < 480) && $scope.triggerItems[i].isScale !== true) {
						$scope.triggerItems[i].validationImage = true;
						$scope.validationImage = true;
						$scope.triggerItems[i].messageError="Size image is too small(640x480)";
					} else {
						$scope.triggerItems[i].messageError="";
					}
				}
			}
		}

		$scope.triggerUpload = function () {
			//Trigger event onchange
			$("#uploadHelper").val("");

			angular.element("#uploadHelper").trigger("click");
			return false;
		};

		$scope.triggerAddKeyword = function (key, url) {
			if (key && url) {
				var keyword = NewCampaignTriggerViewModel.getInstance().setKeyword(key, url);
				addTriggerItems(keyword);
				$('#modalKeyword').modal('hide');
			} else if (!key) {
				PopupMessageService.showAlertMessage("Please enter a keyword.", false);
				return false;
			} else if (!url) {
				PopupMessageService.showAlertMessage("Please enter a valid url.", false);
				return false;
			}

		};

		$scope.onSubmitTrigger = function () {
			var campaignImage = getFirstTriggerImage();

			if ($scope.triggerItems.length == 0) {
				PopupMessageService.showAlertMessage("Please add keyword or trigger first", false);
				return false;
			}

			if (campaignImage == null) {
				PopupMessageService.showAlertMessage("Please upload at least one image before we can submit", false);
				return false;
			}

			// now we submit
			// add campaign first
			var data = {
				brandID: $scope.brandId,
				type: 'image',
				title: $scope.model.title,
				url: $scope.model.url,
				file_name: campaignImage.fileName,
				content: campaignImage.contentBase64
			};

			$scope.isProcessing = true;
			CampaignService.create(data).then(function (campaign) {
				// we have the campaign, now we add all the remain triggers
				var paramTrigger  = {
					campaignID:  campaign.id,
					url: $scope.model.url,
					content_list: JSON.stringify(_.pluck($scope.triggerItems, "contentBase64")),
					filename_list: JSON.stringify(_.pluck($scope.triggerItems, "fileName"))
				}

				CampaignService.createMultiTrigger(paramTrigger).then(function(respone){
					$scope.isProcessing = false;
					countError = $scope.triggerItems.length - respone.triggers.length;
					countSuccess = respone.triggers.length;
					// PopupMessageService.showAlertMessage("Trigger saved: " + countSuccess + " successed, " + countError + " failed", true, 4000, function () {
					// 	$state.go('home.brandDetails.campaigns', { brandId: $scope.brandId });
					// });
					PopupMessageService.showAlertMessage("Create campaign successfully!", true, 4000, function () {
						$state.go('home.brandDetails.campaigns', { brandId: $scope.brandId });
					});

				}, function (err) {
					$scope.isProcessing = false;
					PopupMessageService.showAlertMessage(err, false);
				});

			}, function (err) {
				$scope.isProcessing = false;
				PopupMessageService.showAlertMessage(err, false);
			});

			return false;
		};

		$scope.changeAccount = function () {
			$state.go('login.signUp');
		}

		decideTogoStep2();
	});


})(angular, _);
