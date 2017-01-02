(function (angular, _) {
	'use strict';

	angular.module('feedModule').controller('EditFeedsController', function ($scope, $state, CampaignService, $uibModalInstance, PopupMessageService, FeedModuleModel) {

		$scope.isLoading = false;
		$scope.listCampaignsAll = angular.copy(FeedModuleModel.getListCampaigns());
		$scope.listCampaignsBackup = FeedModuleModel.getListCampaigns();
		$scope.isAllfeed = '0';
		// console.log($scope.listCampaignsAll);
		// $scope.viewby = 10;
		// $scope.totalItems = $scope.listCampaignsAll.length;
		// $scope.currentPage = 1;
		// $scope.itemsPerPage = $scope.viewby;
		// $scope.maxSize = 5; //Number of pager buttons to show
		$scope.dataTypes2 = [
      {id: 'image', name: 'Images'},
      {id: 'magazine', name: 'Magazine'},
      {id: 'video', name: 'Videos'}
    ];


		$scope.setAllFeed = function() {
			for(var i = 0; i < $scope.listCampaignsAll.length; i++) {
				$scope.listCampaignsAll[i].is_feed = $scope.isAllfeed;
			}
		};

		$scope.closeModal = function () {
			// for(var i = 0; i < $scope.listCampaignsAll.length; i++) {
			// 	$scope.listCampaignsAll[i].is_feed = $scope.listCampaignsBackup[i].is_feed;
			// }
			$uibModalInstance.dismiss('cancel');
		};

		$scope.searchTypeCampaign = function(flag) {
			if(flag === true) {
				if($scope.searchType) {
					$scope.listCampaignsAll = _.filter($scope.listCampaignsBackup, function(campaign) {return campaign.type === $scope.searchType});
				} else {
					$scope.listCampaignsAll = $scope.listCampaignsBackup;
				}
			} else {
				if($scope.searchName) {
					$scope.listCampaignsAll = _.filter($scope.listCampaignsBackup, function(campaign) {return campaign.title.toUpperCase().indexOf($scope.searchName.toUpperCase()) > -1});
				} else {
					$scope.listCampaignsAll = $scope.listCampaignsBackup;
				}
			}

			//$scope.totalItems = $scope.listCampaigns.length;
		};

		$scope.updateFeeds = function() {
			$scope.isLoading = true;
			var data = '';
			for(var i = 0; i < $scope.listCampaignsAll.length; i++) {
				if($scope.listCampaignsAll[i].is_feed === '1' || $scope.listCampaignsAll[i].is_feed === true) {
					data += ',' + $scope.listCampaignsAll[i].id;
				}
			}
			if(data === '') data = ',0';
			var query = {campaignID_list: data.substring(1, data.length)};

			CampaignService.updateFeeds(query).then(function (response) {
				$scope.isLoading = false;
				PopupMessageService.showAlertMessage("Update feeds successful!", true, 4000, function () {
					//return value from server
					$uibModalInstance.close(response);
					FeedModuleModel.setListCampaigns($scope.listCampaignsAll);
					$state.go('home.feeds');
				});
			}, function (err) {
				PopupMessageService.showAlertMessage(err, false);
			});
		};
	});


})(angular, _);
