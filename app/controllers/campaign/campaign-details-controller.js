(function (angular, _) {
    'use strict';

    angular.module('campaignModule').controller('createCampaignDetails', function ($scope, $state, $sce, $stateParams, $uibModal, $localStorage,
                                                                                   PopupMessageService, ProductService, CampaignModuleModel, ProductModuleModel, CampaignService, BrandService) {
        //Variable
        $scope.brands = [];
        $scope.campaign = CampaignModuleModel.getCampaign();
        $scope.triggerItems = CampaignModuleModel.getTriggerItems();
        $scope.dataTimeLine = CampaignModuleModel.getDataTimeLine();
        if (!$scope.triggerItems || $scope.triggerItems.length === 0) {
            $state.go('home.brandDetails.createCampaignSetTrigger');
        }

        $scope.$watch('currentFrame', function (oldValue, newValue) {
            if ($scope.currentFrame
                && $scope.currentFrame.url
                && $scope.currentFrame.url.indexOf('http://') < 0
                && $scope.currentFrame.url.indexOf('https://') < 0
                && $scope.currentFrame.url.length !== 0) {
                $scope.currentFrame.url = 'http://' + $scope.currentFrame.url;
            }
        }, true);

        if ($scope.campaign.type === 'video') {
            $scope.currentFrame = $scope.dataTimeLine[0] || {products: []};
        } else {
            $scope.currentFrame = $scope.triggerItems[0] || {products: []};
        }

        if ($scope.currentFrame && $scope.currentFrame.url && $scope.currentFrame.url.indexOf('http://') < 0 && $scope.currentFrame.url.indexOf('https://') < 0 && $scope.currentFrame.url.length !== 0) {
            $scope.currentFrame.url = 'http://' + $scope.currentFrame.url;
        }

        $scope.isProcessing = false;
        //Variable PDF
        $scope.currentPage = 0;
        //$scope.listFrames = CampaignModuleModel.getListFrames();
        //Variable video
        $scope.campaign.videoLength = $scope.triggerItems.length;

        if ($scope.campaign && $scope.campaign.type === 'video' && $scope.campaign.image_url) {
            $("#videoCampain source").attr("src", $scope.campaign.image_url);
            $("#videoCampain")[0].load();
        }


        //------------------------function public-----------------------------------
        $scope.save = function () {
            $scope.isProcessing = true;
            if ($scope.campaign.id) {
                updateCampaign();
            } else {
                createCampaign();
            }
        };

        $scope.previousStep = function () {
            if ($scope.campaign.type === 'video') {
                $scope.campaign.custom ? $state.go('home.brandDetails.recipe') : $state.go('home.brandDetails.editCampaignVideo', {
                    id: $scope.campaign.id
                });
            } else {
                $state.go('home.brandDetails.createCampaignImageLinkProduct');
            }
        };

        // $scope.selectBrand = function (brand) {
        // 	$scope.brandSel = brand;
        // };

        $scope.nextTrigger = function () {
            if ($scope.campaign.type !== 'video') {
                var length = $scope.triggerItems.length;
                if ($scope.currentPage < length - 1) {
                    $scope.currentPage++;
                    $scope.currentFrame = $scope.triggerItems[$scope.currentPage];
                    viewProductsOnPhone($scope.currentFrame.products, $scope.currentFrame.url);
                }
            } else {
                var length = $scope.dataTimeLine.length;
                if ($scope.currentPage < length - 1) {
                    $scope.currentPage++;
                    $scope.currentFrame = $scope.dataTimeLine[$scope.currentPage];
                    viewProductsOnPhone($scope.currentFrame.products, $scope.currentFrame.url);
                }
            }

        };

        $scope.previousTrigger = function () {
            if ($scope.campaign.type !== 'video') {
                if ($scope.currentPage > 0) {
                    $scope.currentPage--;
                    $scope.currentFrame = $scope.triggerItems[$scope.currentPage];
                    viewProductsOnPhone($scope.currentFrame.products, $scope.currentFrame.url);
                }
            } else {
                if ($scope.currentPage > 0) {
                    $scope.currentPage--;
                    $scope.currentFrame = $scope.dataTimeLine[$scope.currentPage];
                    viewProductsOnPhone($scope.currentFrame.products, $scope.currentFrame.url);
                }
            }
        };

        //--------------------------------------------function private------------------------------
        var createCampaign = function () {
            var data = {
                brandID: $scope.brands.selectedBrand.id,
                title: $scope.campaign.title,
                url: $scope.campaign.url,
                type: $scope.campaign.type,
                file_name: $scope.triggerItems[0].fileName,
                content: $scope.triggerItems[0].contentBase64,
                custom: $scope.campaign.custom
            };

            if (data.url.indexOf('http://') < 0 && data.url.indexOf('https://') < 0 && data.url.length !== 0) {
                data.url = 'http://' + data.url;
            }

            CampaignService.create(data).then(function (campaign) {
                createTrigger(campaign.id, campaign.url, $scope.triggerItems, "Create campaign successfully!");
            }, function (err) {
                $scope.isProcessing = false;
                PopupMessageService.showAlertMessage(err, false);
            });
        };

        var updateCampaign = function () {
            var data = {
                custom: $scope.campaign.custom,
                campaignID: $scope.campaign.id,
                title: $scope.campaign.title,
                url: $scope.campaign.url
            };

            if (data.url.indexOf('http://') < 0 && data.url.indexOf('https://') < 0 && data.url.length !== 0) {
                data.url = 'http://' + data.url;
            }

            CampaignService.updateCampaign(data).then(function (campaign) {
                //$scope.isProcessing = false;
                console.log("Update campaign successfull");

                var tempList = angular.copy($scope.triggerItems);
                var listIDs = CampaignModuleModel.getTriggerItemIDsEdit();

                if ($scope.campaign.type === 'image' || $scope.campaign.type === 'magazine') {
                    deleteTrigger(listIDs, tempList);

                    for (var i = 0; i < tempList.length; i++) {
                        //Update
                        if (tempList[i].id) {
                            updateTrigger(tempList[i], "Update campaign successfully!");
                            tempList.splice(i, 1);
                            i--;
                        }
                    }
                    //Create
                    createTrigger($scope.campaign.id, $scope.campaign.url, tempList, "Update campaign successfully!");
                } else {
                    for (var i = 0; i < tempList.length; i++) {
                        //Update
                        if (tempList[i].isEdit) {
                            updateTrigger(tempList[i], "Update campaign successfully!");
                        }
                    }
                    if ($scope.countTriggersBefore === 0) {
                        PopupMessageService.showAlertMessage("Update campaign successfully!", true, 4000, function () {
                            $scope.isProcessing = false;
                            $state.go('home.brandDetails.campaigns');
                        });
                    }
                }

            }, function (err) {
                PopupMessageService.showAlertMessage(err, false);
            });


        };

        $scope.countTriggersBefore = 0;
        $scope.countTriggersAfter = 0;
        var createTrigger = function (campaignID, campaignUrl, triggerItems, message) {
            if (triggerItems.length > 0) {
                _.each(triggerItems, function (trigger) {
                    if (trigger.url.indexOf('http://') < 0 && trigger.url.indexOf('https://') < 0 && trigger.url.length !== 0) {
                        trigger.url = 'http://' + trigger.url;
                    }
                });
                var paramTrigger = {
                    url: triggerItems[0].url || campaignUrl,
                    campaignID: campaignID,
                    content_list: JSON.stringify(_.pluck(triggerItems, "contentBase64")),
                    filename_list: JSON.stringify(_.pluck(triggerItems, "fileName"))
                };
                var products = triggerItems[0].products;
                CampaignService.createMultiTrigger(paramTrigger).then(function (respone) {
                    //$scope.isProcessing = false;
                    //Just only for images
                    $scope.countTriggersBefore++;
                    associateProductToTriggers(respone.triggers, products, message);
                    // PopupMessageService.showAlertMessage(message, true, 4000, function () {
                    // 	$state.go('home.brandDetails.campaigns');
                    // 	$state.go('home.brandDetails.campaigns');
                    // });
                }, function (err) {
                    $scope.isProcessing = false;
                    PopupMessageService.showAlertMessage(err, false);
                });
            } else if ($scope.countTriggersBefore === 0) {
                PopupMessageService.showAlertMessage(message, true, 4000, function () {
                    $scope.isProcessing = false;
                });
            }
        };

        var updateTrigger = function (trigger, message) {
            if (!trigger.url || trigger.url.length === 0) {
                trigger.url = "";
            }
            if (trigger.url.indexOf('http://') < 0 && trigger.url.indexOf('https://') < 0 && trigger.url.length !== 0) {
                trigger.url = 'http://' + trigger.url;
            }
            var query = {
                triggerID: trigger.id,
                url: trigger.url,
                type: trigger.type || $scope.campaign.type,
                content: trigger.content,
                file_name: trigger.file_name || "1"
            };

            if (query.type == 'image') {
                if (!query.content || query.content === trigger.image_url) {
                    delete query.content;
                    delete query.type;
                } else {
                    query.content = trigger.image_url;
                }
            }

            CampaignService.updateTrigger(query).then(function (response) {
                console.log("Update successfull");
            }, function (err) {
                PopupMessageService.showAlertMessage(err, false);
            });

            $scope.countTriggersBefore++;
            associateProductToTriggers([trigger], [], message);
        };

        var deleteTrigger = function (listIDs, tempList) {
            if (!!!listIDs || !!!tempList) {
                return;
            }
            var flag = false;
            for (var i = 0; i < listIDs.length; i++) {
                for (var j = 0; j < tempList.length; j++) {
                    if (tempList[j].id === listIDs[i]) flag = true;
                }
                if (flag === false) {
                    CampaignService.deleteTrigger({
                        triggerID_list: listIDs[i]
                    }).then(function () {
                        console.log("Delete successfull");
                    }, function (err) {
                        PopupMessageService.showAlertMessage(err, false);
                    });
                }
                flag = false;
            }
        };

        var associateProductToTriggers = function (triggers, products, message) {
            var productIds = [];
            var quantityLists = [];
            // TO DO: use an array of triggerID instead of looping throught each item
            var triggerIds = [];

            for (var j = 0; j < triggers.length; j++) {
                if (products.length !== 0) {
                    //JUST ONLY IMAGES
                    productIds = _(products).pluck("id").value().join(",");
                    quantityLists = _(products).pluck("quantity").value().join(",");
                } else {
                    productIds = _(triggers[j].products).pluck("id").value().join(",");
                    quantityLists = _(triggers[j].products).pluck("quantity").value().join(",");
                    products = triggers[j].products || [];
                }

                //TODO set type products
                var typeList = '';
                for (var i = 0; i < products.length; i++) {
                    if (!products[i].type) products[i].type = 'similar';
                    typeList += products[i].type + ',';
                }
                typeList = typeList.substring(0, typeList.length - 1);

                triggerIds.push(triggers[j].id);

                var query = {
                    triggerID: triggers[j].id,
                    productID_list: productIds,
                    type_list: typeList,
                    quantity_list: quantityLists
                };

                if (products.length <= 0) {
                    delete query.type_list;
                    delete query.productID_list;
                    delete query.quantity_list;
                }
            }

            query.triggerID = triggerIds.toString();
            ProductService.associateTriggerProduct(query).then(function (res) {
                if (res.status_code == 200) {
                    console.log("Associate successfull");
                    $scope.countTriggersAfter++;
                    //$scope.isProcessing = true;
                    if ($scope.countTriggersAfter === $scope.countTriggersBefore) {
                        $scope.isProcessing = false;
                        PopupMessageService.showAlertMessage(message, true, 4000, function () {
                            $state.go('home.brandDetails.campaigns');
                        });
                    }
                } else {
                    PopupMessageService.showAlertMessage("Associate fail!", true);
                }
            });
        };

        var getListBrands = function () {
            BrandService.getList({}).then(function (brands) {
                $scope.brands = brands;
                $scope.brands.selectedBrand = brands[0];
            });
        };

        var viewProductsOnPhone = function (products, triggerUrl) {
            if (triggerUrl
                && triggerUrl.indexOf('http://') < 0
                && triggerUrl.indexOf('https://') < 0 && triggerUrl.length !== 0) {
                triggerUrl = 'http://' + triggerUrl;
            }
            $scope.listSelectedProductsView = angular.copy(products);
            $scope.urltrigger = $sce.trustAsResourceUrl(triggerUrl);
            $scope.mainProduct = {};
            if (products.length > 0) {
                for (var i = 0; i < products.length; i++) {
                    if (products[i].type === 'main') {
                        $scope.mainProduct = products[i];
                        $scope.listSelectedProductsView.splice(i, 1);
                        break;
                    }
                }
            }
        };

        viewProductsOnPhone($scope.currentFrame.products, $scope.currentFrame.url);

        getListBrands();
    });


})(angular, _);
