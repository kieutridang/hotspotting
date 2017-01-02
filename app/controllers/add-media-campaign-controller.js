(function (angular, _) {
	'use strict';

	var controllers = angular.module('controllers');

	controllers.controller('AddMediaCampaignController', function ($scope, $sce, $state, $stateParams,
		$localStorage, $timeout, $q, CampaignService, BrandService,  PopupMessageService) {

		$scope.brandId = parseInt($stateParams.brandId);

		$scope.brandSel = { name : 'Select'};
		$scope.brands = [];
		$scope.languages = ['English','Arabic','Chinese Simplified','Chinese Traditional','Hindi',
			'Japanese', 'Korean','Thai'];

		$scope.dropOpen = {
			brand: false,
			language:  false
		}

		$scope.isProcessing = false;
		$scope.campaignModel = {
			file_name: "",
			name: "",
			url: "",
			language : "English",
			content: {}
		};

		BrandService.getList({}).then(function (brands) {
			$scope.brands = brands;
			if ($scope.brandId) {
				$scope.brandSel = _.find($scope.brands, function(item){
					return item.id == $scope.brandId;
				});
			} else if (brands.length > 0) {
				$scope.brandSel = brands[0];
			}

		});

		$scope.selectBrand = function (brand) {
			$scope.brandSel = brand;
		}

		$scope.selectLanguage = function (language) {
			$scope.campaignModel.language = language;
		}

		$scope.createPrintFileCampaign = function (editPrintFileForm) {
			editPrintFileForm.$setSubmitted();
			if (!editPrintFileForm.$valid) return;

			$scope.isProcessing = true;

			var formData = new FormData();
			var file = $('#media-file')[0].files[0];

			formData.append("content", file);
			formData.append("brandID", $scope.brandSel.id);
			formData.append("type", 'magazine');

			formData.append("title", $scope.campaignModel.name);
			formData.append("url", $scope.campaignModel.url);
			formData.append("file_name", $scope.campaignModel.file_name);
			
			$scope.isProcessing = true;
			CampaignService.addMediaCampaign(formData).then(function (result) {
				$scope.isProcessing = false;

				var campaign = result;
				$localStorage.mediaCampaign = campaign;

				function goEditTrigger() {
					$state.go('home.brandDetails.editMediaCampaign', { id: campaign.id });
				}

				PopupMessageService.showAlertMessage("Create campaign successfully", true, 3000, goEditTrigger);
			}, function (err) {
				$scope.isProcessing = false;
				PopupMessageService.showAlertMessage(err, false);
			});
		}

		$scope.fileNameChanged = function (file) {
			$timeout(function () {
				$scope.campaignModel.file_name = file.files[0].name;
			}, 100);
		}
	});



})(angular, _);


