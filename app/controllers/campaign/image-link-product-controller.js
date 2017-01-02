(function(angular, _) {
    'use strict';

    angular.module('campaignModule').controller('createCampaignImageLinkProduct', function($scope, $state, $stateParams, $uibModal, $localStorage,
        PopupMessageService, ProductService, CampaignModuleModel, ProductModuleModel, $timeout) {
        //Variable
        $scope.setURL = false;
        $scope.listAllProducts = [];
        $scope.currentFrame = {};
        $scope.campaign = CampaignModuleModel.getCampaign();
        $scope.triggerItems = CampaignModuleModel.getTriggerItems();
        if (!$scope.triggerItems || $scope.triggerItems.length === 0) {
            $state.go('home.brandDetails.createCampaignSetTrigger');
        } else {
            $scope.currentFrame = $scope.triggerItems[0];
        }
        //$scope.listSelectedProducts = CampaignModuleModel.getListSelectedProducts();
        //$scope.listSelectedProducts = $scope.triggerItems[0].products;


        // //Default value
        if (!$scope.campaign) $scope.campaign = {};
        if (!$scope.campaign.url) $scope.campaign.url = "http://www.ulab.com";

        //Variable PDF
        $scope.currentPage = 0;

        //-------------------------------------------------Public function----------------------------------------------
        $scope.previousStep = function() {
            CampaignModuleModel.setListSelectedProducts($scope.listSelectedProducts);
            $state.go('home.brandDetails.createCampaignSetTrigger');
        };

        $scope.nextStep = function() {
            CampaignModuleModel.setCampaign($scope.campaign);
            //CampaignModuleModel.setListSelectedProducts($scope.listSelectedProducts);
            CampaignModuleModel.setTriggerItems($scope.triggerItems);
            $state.go('home.brandDetails.createCampaignDetails');
        };
        $scope.selectProductToLink = function(product, e) {
            e.preventDefault();
            e.stopPropagation();
            var index = -1;
            if ($scope.currentFrame.products.length === 0) {
                //product.type = 'main';
                product.isSelected = true;
                $scope.currentFrame.products.push(angular.copy(product));
                $scope.currentFrame.products[0].type = 'main';
            } else {
                for (var i = 0; i < $scope.currentFrame.products.length; i++) {
                    if ($scope.currentFrame.products[i].id === product.id) {
                        index = i;
                        break;
                    }
                }
                if (index === -1) {
                    product.isSelected = true;
                    $scope.currentFrame.products.push(angular.copy(product));
                }
            }
            //Update products by triggers
            updateProductByTriggers();
        };

        $scope.unSelectProductToLink = function(product, e) {
            e.preventDefault();
            e.stopPropagation();
            var index = -1;
            var flagMain = false;
            for (var i = 0; i < $scope.currentFrame.products.length; i++) {
                if ($scope.currentFrame.products[i].id === product.id) {
                    index = i;
                    break;
                }
            }
            if (index > -1) {
                product.isSelected = false;
                if ($scope.currentFrame.products[index].type === 'main' && $scope.currentFrame.products.length > 0) {
                    var flagMain = true;
                }
                $scope.currentFrame.products.splice(index, 1);
                if (flagMain && $scope.currentFrame.products.length > 0) $scope.currentFrame.products[0].type = 'main';
            }
            //Update products by triggers
            updateProductByTriggers();
            setStatusProduct();
        };

        $scope.setMainProduct = function(product, e) {
            e.preventDefault();
            e.stopPropagation();
            for (var i = 0; i < $scope.currentFrame.products.length; i++) {
                if (product.id === $scope.currentFrame.products[i].id) {
                    $scope.currentFrame.products[i].type = 'main';
                } else {
                    $scope.currentFrame.products[i].type = 'similar';
                }
            }
        }

        $scope.deleteProduct = function(product, e) {
            e.preventDefault();
            e.stopPropagation();
            var indexList = $scope.listAllProducts.indexOf(product);
            var indexSelected = -1;
            if ($scope.listSelectedProducts) indexSelected = $scope.listSelectedProducts.indexOf(product);
            ProductModuleModel.setProduct(product);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/products/modal-delete-product.html',
                // size: 'sm',
                windowClass: "modal-product",
                backdrop: 'static',
                controller: 'AEDProductController',
                resolve: {
			        viewOnly: function() {
						return false;
					}
				}
            });
            modalInstance.result.then(function(result) {
                //Update
                $scope.listAllProducts.splice(indexList, 1);
                if (indexSelected > -1) $scope.listSelectedProducts.splice(indexSelected, 1);
            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.showProductDetail = function(product, e) {
			e.preventDefault();
			e.stopPropagation();
            var indexList = $scope.listAllProducts.indexOf(product);
            var indexSelected = -1;
            if ($scope.listSelectedProducts) indexSelected = $scope.listSelectedProducts.indexOf(product);
            ProductModuleModel.setProduct(product);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/products/modal-add-edit-product.html',
                // size: 'sm',
                windowClass: "modal-product",
                backdrop: 'static',
                controller: 'AEDProductController',
				resolve: {
			        viewOnly: function() {
						return false;
					}
				}
            });
            modalInstance.result.then(function(result) {
                //Update
                $scope.listAllProducts[indexList] = result;
                if (indexSelected > -1) $scope.listSelectedProducts[indexSelected] = result;
            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

		$scope.viewProductDetail = function(product, e) {
			e.preventDefault();
			e.stopPropagation();
			var indexList = $scope.listAllProducts.indexOf(product);
            var indexSelected = -1;
            if ($scope.listSelectedProducts) indexSelected = $scope.listSelectedProducts.indexOf(product);
            ProductModuleModel.setProduct(product);
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/products/modal-add-edit-product.html',
                // size: 'sm',
                windowClass: "modal-product",
                backdrop: 'static',
                controller: 'AEDProductController',
				resolve: {
			        viewOnly: function() {
						return true;
					}
				}
            });
            modalInstance.result.then(function(result) {
                //Update
                $scope.listAllProducts[indexList] = result;
                if (indexSelected > -1) $scope.listSelectedProducts[indexSelected] = result;
            }, function() {
                console.log('Modal dismissed at: ' + new Date());
            });
		}

        $scope.setCampaignURL = function(flag) {
            $scope.setURL = flag;
        };

        $scope.nextTrigger = function() {
            var length = $scope.triggerItems.length;
            if ($scope.currentPage < length - 1) {
                $scope.currentPage++;
                $scope.currentFrame = $scope.triggerItems[$scope.currentPage];
                setStatusProduct();
            }
        };

        $scope.previousTrigger = function() {
            if ($scope.currentPage > 0) {
                $scope.currentPage--;
                $scope.currentFrame = $scope.triggerItems[$scope.currentPage];
                setStatusProduct();
            }
        };

        $scope.plusQuantity = function(product, e) {
            e.preventDefault();
            e.stopPropagation();
            product.quantity++;
            for (var i = 0; i < $scope.currentFrame.products.length; i++) {
                if ($scope.currentFrame.products[i].id === product.id) {
                    $scope.currentFrame.products[i].quantity++;
                }
            }
        }

        $scope.subQuantity = function(product, e) {
            e.preventDefault();
            e.stopPropagation();
            if (product.quantity === 1) return;
            product.quantity--;
            for (var i = 0; i < $scope.currentFrame.products.length; i++) {
                if ($scope.currentFrame.products[i].id === product.id) {
                    $scope.currentFrame.products[i].quantity--;
                }
            }
        }

        //-----------------------------------------Private function-----------------------------------------------
        var getALLProducts = function() {
            ProductService.getProducts({}).then(function(result) {
                $scope.listAllProducts = _.map(result, function(item) {
                    var it = item;
                    it.price = parseFloat(item.price);
                    it.quantity = 1;
                    return it;
                });
                setStatusProduct();
                $timeout(function() {
                    $(".scrollbarJQuery").niceScroll({
                        "cursorcolor": "#424242",
                        "railalign": "right",
                        "cursorwidth": "7px",
                        "cursorminheight": 100
                    });
                    $(".linked-product-pdf").niceScroll({
                        "cursorcolor": "#424242",
                        "railalign": "right",
                        "cursorwidth": "7px",
                        "cursorminheight": 100
                    });
                }, 100);
            });
        };

        var updateProductByTriggers = function() {
            //Update triggers
            for (var i = 0; i < $scope.triggerItems.length; i++) {
                if ($scope.campaign.type === 'image') {
                    $scope.triggerItems[i].products = $scope.currentFrame.products;
                } else if ($scope.triggerItems[i].id === $scope.currentFrame.id) {
                    $scope.triggerItems[i].products = $scope.currentFrame.products;
                }
            }
        };

        var setStatusProduct = function() {
            for (var i = 0; i < $scope.listAllProducts.length; i++) {
                $scope.listAllProducts[i].isSelected = false;
                $scope.listAllProducts[i].quantity = 1;
                if ($scope.currentFrame.products) {
                    for (var j = 0; j < $scope.currentFrame.products.length; j++) {
                        if ($scope.currentFrame.products[j].id === $scope.listAllProducts[i].id) {
                            $scope.listAllProducts[i].isSelected = true;
                            $scope.listAllProducts[i].quantity = $scope.currentFrame.products[j].quantity;
                        }
                    }
                }
            }
        }

        getALLProducts();
        $('#productCMSScroll,#productCMSScroll1').bind('scroll', function() {
            if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight / 2 && $scope.isLoading === false)
            {
                $scope.isLoading = true;
                $scope.page_per++;
                loadProductCMS();
            }
        });
        $scope.searchProductCMS = function() {
            if($scope.searchTitleProduct.length > 2) {
                $scope.page_per = 1;
                $scope.productsCMS = [];
                loadProductCMS();
            }
        };

        $scope.isLoading = false;
        $scope.page_per = 1;
        function loadProductCMS() {
            var params = {
                search: $scope.searchTitleProduct,
                page_per: $scope.page_per * 20
            };
            ProductService.getProductsFromCMS(params).then(function(res){
                $scope.productsCMS = JSON.parse(res);
                $scope.isLoading = false;
                $timeout(function () {
                    $("#productCMSScroll").niceScroll();
                }, 1000);
            })
        }
        $scope.createProductFromCMS = function(product) {
            product.isLoading = true;
            if(!product.description) {
                product.description = product.name;
            }
            if(product.name && product.price_min && product.medium_image && product.vendor_url) {
                var query = {
                    product_dbID: product.id,
                    title: product.name,
                    desc: product.description,
                    price: product.price_min,
                    url: product.vendor_url,
                    image_url: product.medium_image,
                    file_name: 'product' + product.asin + '.png'
                };

                ProductService.createProduct(query).then(function(res) {
                    product.isLoading = false;
                    if (res['status_code'] == "200") {
                        PopupMessageService.showAlertMessage("Create product successfull!", true);
                        $scope.listAllProducts.unshift(res.product);
                    } else {
                        var message = res && res.message ? res.message : "Create product fail!";
                        PopupMessageService.showAlertMessage(message, true);
                    }
                });
            }
        };
        $scope.showAddProductDB = false;
    });


})(angular, _);
