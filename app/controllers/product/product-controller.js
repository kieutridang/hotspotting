(function (angular, _) {
    'use strict';

    angular.module('productModule').controller('ProductController', ['$rootScope', '$scope', '$timeout', '$uibModal', 'ProductService', 'BrandService', 'CampaignService', 'PopupMessageService', 'ProductModuleModel',
        function ($rootScope, $scope, $timeout, $uibModal, ProductService, BrandService, CampaignService, PopupMessageService, ProductModuleModel) {
            $("#tableBodyScroll").niceScroll();

            $scope.getProducts = getProducts();
            function getProducts() {
                $scope.productParams = {};
                ProductService.getProducts($scope.productParams).then(function (result) {
                    $scope.products = _.map(result, function (item) {
                        var it = item;
                        it.price = parseFloat(item.price);
                        return it;
                    });
                });
            }

            $scope.reverse = true;
            $scope.order = order;
            function order(predicate) {
                $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
                $scope.predicate = predicate;
            }

            $scope.getBrands = getBrands();
            function getBrands() {
                var param = {};
                BrandService.getList(param).then(function (result) {
                    $scope.brandsList = result;
                    if ($scope.brandsList.length > 0) {
                        $scope.brandSel = $scope.brandsList[0];
                        getCampaigns();
                    }
                }, function (err) {
                    PopupMessageService.showAlertMessage(err, false);
                });
            }

            var campaignStore = {};
            $scope.getCampaigns = getCampaigns;
            function getCampaigns() {
                var brId = $scope.brandSel.id;
                var params = {
                    brandID: brId
                };
                if (campaignStore[brId]) {
                    $scope.campaigns = campaignStore[brId];
                    $scope.campaignSel = $scope.campaigns[0];
                    loadAssociatedProduct();
                } else {
                    CampaignService.getList(params).then(function (cpRes) {
                        if (cpRes.length > 0) {
                            $scope.campaigns = campaignStore[brId] = cpRes;
                            $scope.campaignSel = cpRes[0];
                        } else {
                            $scope.campaignSel = null;
                            $scope.campaigns = [];
                        }

                        loadAssociatedProduct();
                    });
                }
            }

            var associatedProductStore = {};
            $scope.associateCampaign = associateCampaign;
            function associateCampaign() {
                var productIds = _($scope.products).where({selected: true}).pluck("id").value().join(",");
                //if(productIds.length <= 0 ) return;

                var typeList = '';
                var tmp = 0;
                var selectedList = _.filter($scope.products, {selected: true});

                _.forEach(selectedList, function (product) {
                    var type = product.typeSelected == true ? 'main' : 'similar';
                    typeList += tmp == 0 ? type : ',' + type;
                    tmp++;
                });


                if ($scope.campaignSel) {
                    var cpId = $scope.campaignSel.id;
                    var query = {
                        campaignID: cpId,
                        productID_list: productIds,
                        type_list: typeList
                    };

                    if (productIds.length <= 0) {
                        delete query.type_list;
                        delete query.productID_list;
                    }

                    ProductService.associateProduct(query).then(function (res) {
                        if (res.status_code == 200) {
                            associatedProductStore[cpId] = productIds;
                            PopupMessageService.showAlertMessage("Associate successfull!", true);
                        } else {
                            PopupMessageService.showAlertMessage("Associate fail!", true);
                        }
                    })
                }

            }

            var checkProduct = function () {
                if (!$scope.campaignSel) return;
                var selProIds = associatedProductStore[$scope.campaignSel.id];
                _.each($scope.products, function (pro) {
                    pro.selected = _.contains(selProIds, pro.id);
                });
            };

            $scope.loadAssociatedProduct = loadAssociatedProduct;
            function loadAssociatedProduct() {
                if (!$scope.campaignSel) {
                    return;
                }
                var cpId = $scope.campaignSel.id;
                var query = {
                    campaignID: cpId
                };

                ProductService.getProducts(query).then(function (result) {

                    associatedProductStore[cpId] = _.pluck(result, "id");
                    _.forEach($scope.products, function (product) {
                        product.selected = false;
                        _.forEach(result, function (item) {
                            if (product.id == item.id) {
                                product.selected = true;
                                product.typeSelected = item.type == 'main';
                            }
                        })
                    })

                });

            }

            $scope.handleTypeSelected = handleTypeSelected;
            function handleTypeSelected(product) {
                var flag = product.typeSelected == false || _.isUndefined(product.typeSelected) ? true : false;
                _.forEach($scope.products, function (item) {
                    item.typeSelected = false;
                });
                product.typeSelected = flag;
            }

            $scope.selectBrand = function (brand) {
                $scope.brandSel = brand;
                getCampaigns();
            };
            $scope.selectCampaign = function (campaign) {
                $scope.campaignSel = campaign;
                loadAssociatedProduct();
            };

            $scope.isCheckedAllItems = false;
            $scope.toogleCheckAll = function () {
                _.forEach($scope.products, function (item) {
                    item.selected = $scope.isCheckedAllItems;
                });

                $scope.productIds = _($scope.products).where({selected: true}).pluck("id").value().join(",");
                console.log("$scope.productIds --- " + $scope.productIds);
            };

            $scope.checkedProduct = function () {
                $scope.productIds = _($scope.products).where({selected: true}).pluck("id").value().join(",");
                $scope.productsChecked = _.filter($scope.products, {selected: true});
                if ($scope.productsChecked.length == 1) {
                    _.forEach($scope.products, function (item) {
                        item.typeSelected = false;
                    });
                    $scope.productsChecked[0].typeSelected = true;
                }
                console.log("$scope.productIds --- " + $scope.productIds);
            };

            $scope.deleteProductChecked = function () {
                var query = {
                    email: currentUser.email,
                    password: currentUser.password,
                    productID_list: $scope.productIds
                };
                ProductService.delete(query).then(function (res) {
                    if (res.status_code == 200) {
                        $scope.products = _.filter($scope.products, {selected: false});
                        popupMessage(res.message, true);
                    } else {
                        popupMessage(res.message, false);
                    }
                })

            };

            $scope.editProduct = function (product) {
                var index = $scope.products.indexOf(product);
                ProductModuleModel.setProduct(product);
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/products/modal-add-edit-product.html',
                    // size: 'sm',
                    windowClass: "modal-product",
                    backdrop: 'static',
                    controller: 'AEDProductController',
                    resolve: {
                        viewOnly: function () {
                            return false;
                        }
                    }
                });
                modalInstance.result.then(function (result) {
                    $scope.products[index] = result;
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };

            $scope.createProduct = function () {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/products/modal-add-edit-product.html',
                    // size: 'sm',
                    windowClass: "modal-product",
                    backdrop: 'static',
                    controller: 'AEDProductController',
                    resolve: {
                        viewOnly: function () {
                            return false;
                        }
                    }
                });
                modalInstance.result.then(function (results) {
                    if (results) {
                        $scope.products.unshift(results);
                    }
                }, function () {
                    console.log('Modal dismissed at: ' + new Date());
                });
            };

            $scope.confirmDeleteProduct = function (product) {
                $scope.deleteProduct = product;
                PopupMessageService.showConfirmMessage("Are you sure you want to delete this product.?", true, null, deleteProduct);
            };

            $scope.popupConfirmDeleteSelected = function () {
                PopupMessageService.showConfirmMessage("Are you sure you want to delete these products.?", true, null, deleteProductChecked);
            };

            $scope.deleteProduct = deleteProduct;
            function deleteProduct() {
                var cpId = $scope.deleteProduct.id;
                var query = {
                    productID_list: cpId
                };
                ProductService.deleteProduct(query).then(function (res) {
                    if (res.status_code == 200) {
                        angular.forEach($scope.products, function (obj, index) {
                            if (obj.id === $scope.deleteProduct.id) {
                                $scope.products.splice(index, 1);
                                return;
                            }
                        });
                        PopupMessageService.showAlertMessage("Delete successfull!", true);

                    } else {
                        PopupMessageService.showAlertMessage("Delete fail!", true);

                    }
                })
            }

            $scope.deleteProductChecked = deleteProductChecked;
            function deleteProductChecked() {
                var query = {
                    productID_list: $scope.productIds
                };
                ProductService.deleteProduct(query).then(function (res) {
                    if (res.status_code == 200) {
                        $scope.products = _.filter($scope.products, function (item) {
                            if (!item.selected)
                                return item;
                        });
                        PopupMessageService.showAlertMessage("Delete successfull!", true);
                    } else {
                        PopupMessageService.showAlertMessage("Delete fail!", true);
                    }
                })
            }

            $('#productCMSScroll').bind('scroll', function () {
                if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight / 2 && $scope.isLoading === false) {
                    $scope.isLoading = true;
                    $scope.page_per++;
                    loadProductCMS();
                }
            });

            $scope.searchProductCMS = _.debounce(function () {
                if ($scope.searchTitleProduct.length > 2 || $scope.searchBrand.length > 2) {
                    $scope.page_per = 1;
                    $scope.productsCMS = [];
                    loadProductCMS();
                }
            }, 500);

            $scope.page_per = 1;

            $scope.createProductFromCMS = function (product) {
                product.isLoading = true;
                if (!product.description) {
                    product.description = product.name;
                }
                if (product.name && product.price_min && product.medium_image && product.vendor_url) {
                    var query = {
                        product_dbID: product.id,
                        title: product.name,
                        desc: product.description,
                        price: product.price_min,
                        url: product.vendor_url,
                        image_url: product.medium_image,
                        file_name: 'product' + product.asin + '.png'
                    };

                    ProductService.createProduct(query).then(function (res) {
                        product.isLoading = false;
                        if (res['status_code'] == "200") {
                            PopupMessageService.showAlertMessage("Create product successfull!", true);
                            $scope.products.unshift(res.product);
                        } else {
                            var message = res && res.message ? res.message : "Create product fail!";
                            PopupMessageService.showAlertMessage(message, true);
                        }
                    });
                }
            };

            $scope.isLoading = false;

            function loadProductCMS() {
                var params = {
                    search: $scope.searchTitleProduct || '',
                    brand_search: $scope.searchBrand || '',
                    page_per: $scope.page_per * 20
                };
                ProductService.getProductsFromCMS(params).then(function (res) {
                    $scope.productsCMS = JSON.parse(res);
                    $scope.isLoading = false;
                    $timeout(function () {
                        $("#productCMSScroll").niceScroll();
                    }, 1000);
                })
            }
        }]);

})(angular, _);
