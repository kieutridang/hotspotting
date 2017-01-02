(function (angular, _) {
    'use strict';

    angular.module('campaignModule').controller('CampaignsController',
        function ($scope, $state, $stateParams, CampaignService, CampaignModuleModel, PopupMessageService, ProductService, $interval) {

            //Variables
            $scope.listCampaigns = null;
            $scope.listBKCampaigns = null;
            $scope.totalTriggers = 0;
            $scope.totalProducts = 0;
            $scope.totalCampaigns = 0; //Total campaigns found
            $scope.viewby = 10;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.itemsPerPage = $scope.viewby;
            $scope.maxSize = 10; //Number of pager buttons to show
            $scope.currentSortBy = '';
            $scope.currentSortAsc = false;

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
                product_count: 1,
                brandID: $stateParams.brandId
                // limit: 10,
                // offset: 0
            };

            CampaignModuleModel.initCampaignModuleModel();

            //----------------------------Public function----------------------------------------------

            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };

            $scope.pageChanged = function () {
                // $scope.paramCampaigns.offset = ($scope.currentPage - 1) * 10;
                // getListCampaign();
            };

            $scope.setItemsPerPage = function (num) {
                $scope.itemsPerPage = num;
                $scope.currentPage = 1; //reset to first paghe
            };

            $scope.deleteCampaign = function (campaign) {
                PopupMessageService.showConfirmMessage("Are you sure you want to delete this campaign?", true, null, function () {
                    var query = {
                        campaignID_list: campaign.id
                    };
                    campaign.isProcessing = true;
                    campaign.isDeleting = true;
                    CampaignService.deleteCampaign(query).then(function () {
                        campaign.isProcessing = false;
                        getListCampaign();
                        PopupMessageService.showAlertMessage('Delete campaign successful!', true);
                    }, function (err) {
                        PopupMessageService.showAlertMessage(err, false);
                    });
                });
            };

            $scope.updateStatusCampaign = function (campaign) {
                if (campaign.status === 'inactive') {
                    campaign.status = 'active';
                } else {
                    campaign.status = 'inactive';
                }
                var data = {
                    campaignID: campaign.id,
                    status: campaign.status
                };
                CampaignService.updateCampaign(data).then(function () {
                    console.log("update status successful");
                }, function (err) {
                    console.log("update status fail");
                });
            };

            $scope.editTrigger = function (campaign) {
                CampaignService.getTriggers({campaignID: campaign.id, isGetProduct: 1}).then(function (triggerList) {
                    CampaignModuleModel.setCampaign(campaign);
                    var listIDs = [];

                    var tempTriggerItems = triggerList;
                    for (var i = 0; i < triggerList.length; i++) {
                        tempTriggerItems[i].contentBase64 = triggerList[i].image_url;
                        tempTriggerItems[i].content = triggerList[i].image_url;
                        listIDs.push(triggerList[i].id);
                    }
                    if (campaign.type === "magazine" || campaign.type === "video") {
                        tempTriggerItems = tempTriggerItems.reverse();
                    }
                    CampaignModuleModel.setTriggerItems(tempTriggerItems);
                    CampaignModuleModel.setTriggerItemIDsEdit(listIDs);
                    $state.go('home.brandDetails.createCampaignSetTrigger');
                }, function (err) {
                    PopupMessageService.showAlertMessage(err, false);
                });
            };

            $scope.createCampaign = function () {
                $state.go('home.brandDetails.createCampaignSetTrigger');
            };

            $scope.getTotal = function () {
                return $("#tableBody tr").length;
            };

            $scope.filterCampaign = function () {
                $scope.listCampaigns = angular.copy($scope.listBKCampaigns);

                if ($scope.searchTitle && $scope.searchTitle !== '') {
                    // Search by campaign title
                    $scope.listCampaigns = _.filter($scope.listCampaigns, function(campaign) {
                        return campaign.title.toLowerCase().indexOf($scope.searchTitle.toLowerCase()) > -1;
                    });
                }

                if ($scope.searchType && $scope.searchType !== '') {
                    // Search by campaign type
                    $scope.listCampaigns = _.filter($scope.listCampaigns, function(campaign) {
                        return campaign.type === $scope.searchType.id;
                    });
                }

                // Update pagination
                $scope.totalItems = $scope.listCampaigns.length;
                $scope.currentPage = 1;
            };

            $scope.orderBy = function(propName, isCapitalizeOrder) {
                if ($scope.currentSortBy === propName) {
                    $scope.currentSortAsc = !$scope.currentSortAsc;
                } else {
                    $scope.currentSortBy = propName;
                }

                // Capitalize the value before ordering
                if (isCapitalizeOrder) {
                    _.each($scope.listCampaigns, function(campaign) {
                        if (campaign[propName]) {
                            campaign[propName] = _.capitalize(campaign[propName]);
                        }
                    });
                }

                $scope.listCampaigns = _.sortByOrder($scope.listCampaigns, function(campaign) {
                    var nestedProps = propName.split('.');
                    if (nestedProps.length > 1) {
                        // Sort by nested props
                        var sortProp = campaign;
                        _.each(nestedProps, function(nestedProp) {
                            sortProp = sortProp[nestedProp];
                        });
                        return sortProp;
                    } else {
                        return campaign[nestedProps[0]];
                    }
                }, $scope.currentSortAsc ? 'asc' : 'desc');

                // Update pagination
                $scope.totalItems = $scope.listCampaigns.length;
                $scope.currentPage = 1;
            };

            //---------------------------Private function-----------------------------------------------

            function getListCampaign() {
                CampaignService.getCampaignListU($scope.paramCampaigns).then(function (results) {
                    if (results.data.length > 0) {
                        $scope.totalTriggers = results.total_trigger;
                        $scope.totalProducts = results.total_product;
                        $scope.totalCampaigns = results.total_campaign;
                        $scope.listCampaigns = results.data;
                        $scope.totalItems = results.data.length;
                        for (var i = 0; i < $scope.listCampaigns.length; i++) {
                            $scope.listCampaigns[i].date = moment($scope.listCampaigns[i].created_at);
                        }
                        // Create a backup for filtering
                        $scope.listBKCampaigns = angular.copy($scope.listCampaigns);
                        // Order new campaign list
                        $scope.orderBy('date');
                    } else {
                        console.log('No campaign found');
                    }
                });
            }

            getListCampaign();
        });

})(angular, _);
