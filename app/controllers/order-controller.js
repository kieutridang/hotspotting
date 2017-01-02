(function (angular, _) {
    'use strict';

    var controllers = angular.module('controllers');

    controllers.controller('OrderController', ['$rootScope', '$scope', '$timeout', '$uibModal', '$state', '$localStorage', 'OrderService',
        function ($rootScope, $scope, $timeout, $uibModal, $state, $localStorage, OrderService) {
            $("#tableBodyScroll").niceScroll();

            $scope.fromDate = moment();
            $scope.toDate = moment();
            $scope.pOrders = [];
            $scope.viewby = 10;
            $scope.totalItems = 0;
            $scope.currentPage = 1;
            $scope.itemsPerPage = $scope.viewby;
            $scope.dateOptions = [];
            $scope.pOrdersBK = [];
            $scope.listOrdersCVS = [];
            $scope.currentSortBy = 'id';
            $scope.currentSortAsc = false;

            $scope.getHeaderCVS = function () {
                return ["Order No", "Date", "Buyer Name", "Shipping Address", "Shipping City", "Shipping Country", "Shipping Postal Code", "Email", "Mobile", "User Notes", "Interal Notes", "Status", "Total", "Product Name", "Product URL", "Product Quanlity", "Product Price", "Product Price Total", "Product Status"]
            };

            $scope.orderParams = {
                //limit : $scope.pageSize,
                offset: 0,
                from_date: null,
                to_date: null
            };

            $scope.loadingOpts = {
                isLoading: false
            };

            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };

            $scope.pageChanged = function () {
                console.log('Page changed to: ' + $scope.currentPage);
            };

            $scope.setItemsPerPage = function (num) {
                $scope.itemsPerPage = num;
                $scope.currentPage = 1; //reset to first paghe
            };

            $scope.searchOptions = function (prop, value) {
                $scope.pOrders = angular.copy($scope.pOrdersBK);
                filterDateOptions();

                if ($scope.searchOrderNo && $scope.searchOrderNo !== '') {
                    // Search by order id
                    $scope.pOrders = _.filter($scope.pOrders, function(pOrder) {
                        return pOrder.id.toString().indexOf($scope.searchOrderNo) > -1;
                    });
                    filterDateOptions();
                }

                if ($scope.dateSelect && $scope.dateSelect !== '') {
                    // Search by order date
                    $scope.pOrders = _.filter($scope.pOrders, function(pOrder) {
                        return pOrder.date.format('DD/MM/YYYY') === $scope.dateSelect;
                    });
                }

                if ($scope.searchName && $scope.searchName !== '') {
                    // Search by order buyer name
                    $scope.pOrders = _.filter($scope.pOrders, function(pOrder) {
                        return pOrder.shipping_name.toLowerCase().indexOf($scope.searchName.toLowerCase()) > -1;
                    });
                    filterDateOptions();
                }

                // Update pagination
                $scope.totalItems = $scope.pOrders.length;
                $scope.currentPage = 1;
            };

            $scope.getDetailOrder = function(pd) {
                $localStorage.productOrder = pd;
                $state.go('home.orderDetails');
            };

            $scope.orderBy = function(propName, isCapitalizeOrder) {
                if ($scope.currentSortBy === propName) {
                    $scope.currentSortAsc = !$scope.currentSortAsc;
                } else {
                    $scope.currentSortBy = propName;
                }

                // Capitalize the value before ordering
                if (isCapitalizeOrder) {
                    _.each($scope.pOrders, function(pOrder) {
                        if (pOrder[propName]) {
                            pOrder[propName] = _.capitalize(pOrder[propName]);
                        }
                    });
                }
                $scope.pOrders = _.sortByOrder($scope.pOrders, function(pOrder) {
                    var nestedProps = propName.split('.');
                    if (nestedProps.length > 1) {
                        // Sort by nested props
                        var sortProp = pOrder;
                        _.each(nestedProps, function(nestedProp) {
                            sortProp = sortProp[nestedProp];
                        });
                        return sortProp;
                    } else {
                        return pOrder[nestedProps[0]];
                    }
                }, $scope.currentSortAsc ? 'asc' : 'desc');

                // Update pagination
                $scope.totalItems = $scope.pOrders.length;
                $scope.currentPage = 1;
            };

            function getOrders() {
                if ($scope.loadingOpts.isLoading) return;
                $scope.loadingOpts.isLoading = true;
                $scope.pOrders = [];
                OrderService.getOrders($scope.orderParams).then(function (result) {
                    if (result.length > 0) {
                        angular.forEach(result, function (item) {
                            var it = item;
                            it.total_amount = parseFloat(item.total_amount);
                            it.date = moment(it.updated_at);
                            $scope.pOrders.push(it);
                            $scope.listOrdersCVS.push(formatDataCSV(it));
                            for (var i = 0; i < it.products.length; i++) {
                                $scope.listOrdersCVS.push(formatProductDataCSV(it.products[i], it.process_status));
                            }
                        });
                        $scope.orderParams.offset += parseInt($scope.orderParams.limit);
                    }
                    $scope.totalItems = $scope.pOrders.length;
                    $scope.pOrdersBK = angular.copy($scope.pOrders);
                    filterDateOptions();
                    $scope.loadingOpts.isLoading = false;
                });
            }

            function formatDataCSV(order) {
                var user = order.user ? order.user : {};
                return {
                    orderNo: order.id,
                    date: order.date,
                    buyerName: order.buyerName,
                    shippingAddress: order.shipping_address,
                    shippingCity: order.shipping_city,
                    shippingCountry: order.shipping_country,
                    shippingCode: order.shipping_zipcode,
                    email: user.email,
                    mobile: user.mobile,
                    userNotes: user.userNotes,
                    internalNotes: user.internalNotes,
                    status: order.process_status,
                    total: order.total_amount,
                    productName: '',
                    productUrl: '',
                    productQuantity: '',
                    productPrice: '',
                    productTotal: '',
                    productStatus: ''
                };
            }

            function formatProductDataCSV(product, statusOrder) {
                return {
                    orderNo: '',
                    date: '',
                    buyerName: '',
                    shippingAddress: '',
                    shippingCity: '',
                    shippingCountry: '',
                    shippingCode: '',
                    email: '',
                    mobile: '',
                    userNotes: '',
                    internalNotes: '',
                    status: '',
                    total: '',
                    productName: product.product_name,
                    productUrl: product.product_url,
                    productQuantity: product.product_quantity,
                    productPrice: product.product_currency + product.product_price,
                    productTotal: product.product_currency + Math.round(product.product_price * product.product_quantity * 100) / 100,
                    productStatus: statusOrder
                }
            }

            function filterDateOptions() {
                $scope.dateOptions = _.uniq($scope.pOrders, function(pOrder) {
                    return pOrder.date.format('DD/MM/YYYY');
                });
                $scope.dateOptions = _.sortByOrder($scope.dateOptions, function(dateOption) {
                    return dateOption.date;
                }, 'asc');
            }

            getOrders();
        }]);

    controllers.controller('OrderDetailsController', ['$rootScope', '$scope', '$timeout', '$uibModal', '$localStorage', 'OrderService', 'BrandService', 'CampaignService', 'PopupMessageService', '$state',
        function ($rootScope, $scope, $timeout, $uibModal, $localStorage, OrderService, BrandService, CampaignService, PopupMessageService, $state) {

            $(".suadauphong").niceScroll();

            $scope.productOrder = angular.copy($localStorage.productOrder);

            $scope.orderStatus = [
                {id: 'pending', name: 'Pending'},
                {id: 'cancelled', name: 'Cancelled'},
                {id: 'processing', name: 'Processing'},
                {id: 'completed', name: 'Completed'}
            ];

            $scope.totalPrice = 0;

            angular.forEach($scope.productOrder.products, function (val, key) {
                $scope.totalPrice += parseFloat(val.product_price) * parseFloat(val.product_quantity);
            });

            $scope.cancel = function () {
                $state.go('home.orderHistory');
            };

            $scope.save = function () {
                var params = {
                    cartID: $scope.productOrder.id,
                    process_status: $scope.productOrder.process_status,
                    shipping_address: $scope.productOrder.shipping_address,
                    shipping_zipcode: $scope.productOrder.shipping_zipcode,
                    shipping_phone: $scope.productOrder.shipping_phone,
                    shipping_city: $scope.productOrder.shipping_city,
                    shipping_country: $scope.productOrder.shipping_country,
                    shipping_name: $scope.productOrder.shipping_name,
                    product_list: angular.toJson($scope.productOrder.products)
                };
                OrderService.updateOrder(params).then(function (response) {
                    $scope.isLoading = false;
                    PopupMessageService.showAlertMessage("Update order successful!", true, 4000, function () {
                        $state.go('home.orderHistory');
                    });
                }, function (err) {
                    PopupMessageService.showAlertMessage(err, false);
                });
            };

            $scope.changeOrderStatus = function (value) {
                $scope.productOrder.process_status = value;
            };
        }]);

})(angular, _);
