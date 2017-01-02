(function (angular, _) {
	'use strict';

	angular.module('campaignModule').controller('ListFeedsController',
		function ($scope, $state, $stateParams, CampaignService, CampaignModuleModel, PopupMessageService, ProductService, BrandService,FeedModuleModel, $uibModal) {

		//Variables
		$scope.listCampaigns = null;
		$scope.listCampaignsBackup = null;
		$scope.totalTriggers = 0;
		$scope.totalProducts = 0;
		$scope.totalCampaigns = 0; //Total campaigns found
		$scope.viewby = 10;
		$scope.totalItems = 0;
		$scope.currentPage = 1;
		$scope.itemsPerPage = $scope.viewby;
		$scope.maxSize = 10; //Number of pager buttons to show

		//TODO Must to get from data
		$scope.dataTypes = [
      {id: 'image', name: 'Images'},
      {id: 'magazine', name: 'Magazine'},
      {id: 'video', name: 'Videos'}
    ];

		//TODO Must to get from data
		$scope.dataStatus = [
			{id: 'approved', name: 'APPROVED'},
			{id: 'active', name: 'ACTIVE'},
      {id: 'inactive', name: 'INACTIVE'},
      {id: 'training', name: 'TRAINING'},
			{id: 'reject', name: 'REJECT'}
		];
		$scope.paramCampaigns = {
			//brandID: $stateParams.brandId,
			//product_count: 1,
			limit: 100,
			offset: 0
		};

		CampaignModuleModel.initCampaignModuleModel();

		//----------------------------Public function----------------------------------------------

		$scope.setPage = function (pageNo) {
    	$scope.currentPage = pageNo;
  	};

	  $scope.pageChanged = function() {
	    console.log('Page changed to: ' + $scope.currentPage);
			//$scope.paramCampaigns.offset = ($scope.currentPage - 1) * 10;
			// {
			// 	//product_count: 1,
			// 	//brandID: $stateParams.brandId,
			// 	limit: 10,
			// 	offset: ($scope.currentPage - 1) * 10
			// };

			//getListCampaign();
	  };

		$scope.setItemsPerPage = function(num) {
		  $scope.itemsPerPage = num;
		  $scope.currentPage = 1; //reset to first paghe
		};

		$scope.showListfeedcamp = function() {

			var modalInstance = $uibModal.open({
        animation: true,
        templateUrl: 'views/feeds/modal-add-feed-compaign.html',
        // size: 'sm',
        windowClass: "modal-product",
        backdrop: 'static',
        controller: 'EditFeedsController'
      });
			modalInstance.result.then(function (listCampaigns) {
				$scope.listCampignsFeed = _.filter(FeedModuleModel.getListCampaigns(), { is_feed: "1" });
				$scope.totalItems1 = $scope.listCampignsFeed.length;
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		};

		$scope.getTotal = function() {
			return $("#tableBody tr").length;
		};

		$scope.searchTypeCampaign = function(flag) {
			if(flag === true) {
				if($scope.searchType) {
					$scope.listCampaigns = _.filter($scope.listCampaignsBackup, function(campaign) {return campaign.type === $scope.searchType});
				} else {
					$scope.listCampaigns = $scope.listCampaignsBackup;
				}
			} else {
				if($scope.searchName) {
					$scope.listCampaigns = _.filter($scope.listCampaignsBackup, function(campaign) {return campaign.title.toUpperCase().indexOf($scope.searchName.toUpperCase()) > -1});
				} else {
					$scope.listCampaigns = $scope.listCampaignsBackup;
				}
			}

			$scope.totalItems = $scope.listCampaigns.length;
		}

		getListCampaign();

    //Get brand id Default cloud
		function getListCampaign() {
			BrandService.getList({}).then(function (result) {
				$scope.brandsList = result;
				var items = _.filter($scope.brandsList, { type: "cloud" });
				$scope.paramCampaigns.brandID = items[0].id;
				CampaignService.getCampaignListU($scope.paramCampaigns).then(function(results){
					if(results.data.length > 0) {
						console.log(results);
						$scope.totalTriggers = results.total_trigger;
						FeedModuleModel.setListCampaigns(results.data);
						//FeedModuleModel.setListCampaigns(_.filter(results.data, function(campaign) { return campaign.type !== 'magazine'; }));
						$scope.listCampignsFeed = _.filter(FeedModuleModel.getListCampaigns(), { is_feed: "1" });
						$scope.listCampaignsBackup = _.filter(FeedModuleModel.getListCampaigns(), { is_feed: "1" });
						$scope.totalItems1 = $scope.listCampignsFeed.length;
					}
				});
			}, function (err) {
				PopupMessageService.showAlertMessage(err, false);
			});
		};
});


})(angular, _);
