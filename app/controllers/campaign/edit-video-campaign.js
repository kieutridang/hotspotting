(function (angular, _) {
    'use strict';

    angular.module('campaignModule').controller('editCampaignVideo', function ($scope, $state, $stateParams, $uibModal, $localStorage,
                                                                               PopupMessageService, ProductService, CampaignModuleModel, ProductModuleModel, $timeout, $filter) {
        var listAllProducts = [];
        $scope.setPage = false;
        $scope.triggerItems = CampaignModuleModel.getTriggerItems() || [];
        if (!$scope.triggerItems || $scope.triggerItems.length === 0) {
            $state.go('home.brandDetails.createCampaignSetTrigger');
        }
        $scope.campaign = CampaignModuleModel.getCampaign();
        $scope.video = document.getElementById("videoCampain");
        $scope.currentSection = {
            start: -1,
            end: 0,
            products: [],
            id: -1,
            content: "",
            url: ""
        };
        $scope.idDataTimeLine = 1;
        $scope.dataTimeLine = CampaignModuleModel.getDataTimeLine() || [];
        $scope.showNavigationFrame = true;

        $scope.recipe = null;
        if ($scope.campaign && $scope.campaign.type === 'video' && $scope.campaign.image_url) {
            if ($scope.campaign.custom && JSON.parse($scope.campaign.custom)[1]["recipe"] && JSON.parse($scope.campaign.custom)[1]["recipe"].length <= 0) $scope.campaign.custom = null;
            $("#videoCampain source").attr("src", $scope.campaign.image_url);
            $("#videoCampain")[0].load();
        }

        //----------------------------------------Private function-----------------------------
        $timeout(function () {
            $("#navFrame").niceScroll({
                "railvalign": "bottom"
            });
        }, 3000);

        var formatTime = function (number) {
            return (new Date(number * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
        };

        var formatTimeLine = function (number) {
            if (number < 10) {
                return '000' + number + '-01-01';
            } else if (number < 100) {
                return '00' + number + '-01-01';
            } else if (number < 1000) {
                return '0' + number + '-01-01';
            } else {
                return number + '-01-01';
            }
        };

        var checkedInforProducts = function (array1, array2) {
            var flag = false;
            if (array1 && array2 && array1.length === array2.length) {
                for (var i = 0; i < array1.length; i++) {
                    for (var j = 0; j < array2.length; j++) {
                        if (array1[i].id === array2[j].id) {
                            flag = true;
                            break;
                        }
                        flag = false;
                    }
                }
            }
            return flag;
        };

        var initDataTimeLine = function () {
            var array = [];
            for (var i = 0; i < $scope.triggerItems.length; i++) {
                $scope.triggerItems[i].isSelected = false;
                for (var j = i; j < $scope.triggerItems.length; j++) {
                    if (($scope.triggerItems[i].products.length > 0 && !checkedInforProducts($scope.triggerItems[i].products, $scope.triggerItems[j].products))
                        || ($scope.triggerItems[i].url !== "" && $scope.triggerItems[i].url !== $scope.triggerItems[j].url)) {
                        array.push({
                            id: $scope.idDataTimeLine,
                            content: 'SECTION ' + $scope.idDataTimeLine,
                            start: formatTimeLine(i),
                            end: formatTimeLine(j),
                            startNumber: i,
                            endNumber: j - 1,
                            products: $scope.triggerItems[i].products,
                            url: $scope.triggerItems[i].url
                        });

                        $scope.idDataTimeLine++;
                        i = j - 1;
                        break;
                    }
                }
            }
            if ($scope.dataTimeLine.length === 0) $scope.dataTimeLine = array;
            items.update($scope.dataTimeLine);
        };

        var getSecondsFromData = function (data) {
            var array = data.split(":");
            if (array.length === 3) {
                var second = Number(array[2]);
                var minutes = Number(array[1]);
                var hour = Number(array[0]);
                return second + minutes * 60 + hour * 3600;
            }
            return 0;
        };

        var updateSection = function (item, min, max) {
            var startConflicted = _.find($scope.dataTimeLine, function(data) {
                return min >= data.startNumber && min <= data.endNumber && item.id !== data.id;
            });

            var endConflicted = _.find($scope.dataTimeLine, function(data) {
                return max >= data.startNumber && max <= data.endNumber && item.id !== data.id;
            });

            if (startConflicted || endConflicted) {
                PopupMessageService.showAlertMessage("Please select empty section", false);
                items.clear();
                items.update($scope.dataTimeLine);
                $scope.fromFrame = formatTime($scope.currentSection.start);
                $scope.toFrame = formatTime($scope.currentSection.end);
                return;
            }

            for (var i = 0; i < $scope.dataTimeLine.length; i++) {
                if ($scope.dataTimeLine[i].id === item.id) {
                    for (var j = $scope.dataTimeLine[i].startNumber; j <= $scope.dataTimeLine[i].endNumber; j++) {
                        $scope.triggerItems[j].url = [];
                        $scope.triggerItems[j].products = [];
                        $scope.triggerItems[j].isEdit = true;
                        $scope.triggerItems[j].isSelected = false;
                    }
                    $scope.dataTimeLine[i].start = formatTimeLine(min);
                    $scope.dataTimeLine[i].end = formatTimeLine(max + 1);
                    $scope.dataTimeLine[i].startNumber = min;
                    $scope.dataTimeLine[i].endNumber = max;
                }
            }

            var urlSection = $scope.currentSection.url;
            for (var i = min; i <= max; i++) {
                $scope.triggerItems[i].products = item.products;
                $scope.triggerItems[i].isEdit = true;
                $scope.triggerItems[i].isSelected = true;
                $scope.triggerItems[i].url = urlSection;
            }
            $scope.video.currentTime = min;
            $scope.currentSection = {
                start: min,
                end: max,
                products: item.products,
                id: item.id,
                content: item.content,
                url: urlSection
            };
            $scope.fromFrame = formatTime(min);
            $scope.toFrame = formatTime(max);
            items.update($scope.dataTimeLine);
        };

        var resetSelection = function () {
            $scope.fromFrame = "";
            $scope.toFrame = "";
            $scope.currentSection = {
                start: -1,
                end: 0,
                products: [],
                id: -1,
                content: "",
                url: ""
            };
            timeline.setSelection([], {
                focus: true
            });
            for (var i = 0; i < listAllProducts.length; i++) {
                listAllProducts[i].isSelected = false;
                listAllProducts[i].quantity = 1;
            }
        };

        var getPositionTimeLine = function (string, flagStart) {
            var array = string.split("-");
            if (array.length === 3) {
                return flagStart === true ? Number(array[0]) + 1 : Number(array[0]);
            } else if (array.length === 4) {
                return -Number(array[1]) + 1;
            } else {
                return 0;
            }
        };

        var getALLProducts = function () {
            ProductService.getProducts({}).then(function (result) {
                listAllProducts = _.map(result, function (item) {
                    var it = item;
                    it.price = parseFloat(item.price)
                    it.quantity = 1;
                    return it;
                });
                setStatusProduct();
                $scope.filtered = $filter('filter')(listAllProducts, {title: $scope.searchTitle});
                $scope.displayProducts = $scope.filtered.slice(0, $scope.itemsPerPage);
                $timeout(function () {
                    $(".scrollbarJQuery").niceScroll({
                        "cursorcolor": "#424242",
                        "railalign": "right",
                        "cursorwidth": "7px",
                        "cursorminheight": 100
                    });
                }, 100);
            });
        };

        var deleteSection = function (item) {
            var min = item.startNumber;
            var max = item.endNumber;
            for (var i = item.startNumber; i <= item.endNumber; i++) {
                $scope.triggerItems[i].isEdit = true;
                $scope.triggerItems[i].isSelected = false;
                $scope.triggerItems[i].products = [];
                $scope.triggerItems[i].url = "";
            }
            items.remove(item);
            for (var i = 0; i < $scope.dataTimeLine.length; i++) {
                if (item.id === $scope.dataTimeLine[i].id) {
                    $scope.dataTimeLine.splice(i, 1);
                    break;
                }
            }
            $scope.currentSection = {
                start: -1,
                end: 0,
                products: [],
                id: -1,
                content: "",
                url: ""
            };
            $scope.fromFrame = "";
            $scope.toFrame = "";
            setStatusProduct();
        };

        var setStatusProduct = function () {
            for (var i = 0; i < listAllProducts.length; i++) {
                listAllProducts[i].isSelected = false;
                listAllProducts[i].quantity = 1;
                for (var j = 0; j < $scope.currentSection.products.length; j++) {
                    if ($scope.currentSection.products[j].id === listAllProducts[i].id) {
                        listAllProducts[i].isSelected = true;
                        listAllProducts[i].quantity = $scope.currentSection.products[j].quantity;
                    }
                }
            }
        };

        var changeProductPage = function () {
            var startProduct = ($scope.currentProductPage - 1) * $scope.itemsPerPage;
            var endProduct = ($scope.currentProductPage * $scope.itemsPerPage);
            $scope.filtered = $filter('filter')(listAllProducts, {title: $scope.searchTitle});
            $scope.displayProducts = $scope.filtered.slice(startProduct, endProduct);
        };

        var isSectionChanged = function(timeString) {
            var date = moment(timeString).tz("UTC");
            if (date.hour() === 17 && date.minute() === 0 && date.second() === 0) {
                return false;
            }
            return true;
        };

        //-------------------------------Events for video-------------------------------
        $scope.video.onplay = function () {
            $scope.showNavigationFrame = false;
        };

        $scope.video.onpause = function () {
            $scope.showNavigationFrame = true;
            $scope.$apply();
        };

        $scope.video.ontimeupdate = function () {
            var currentTime = Math.round($scope.video.currentTime);
            timeline.customTimes[0].setCustomTime(formatTimeLine(currentTime));
            $scope.fromFrame = "";
            $scope.toFrame = "";
            $scope.currentSection = {
                start: -1,
                end: 0,
                products: [],
                id: -1,
                content: ""
            };
            timeline.setSelection([], {
                focus: true
            });
            for (var i = 0; i < $scope.dataTimeLine.length; i++) {
                if ($scope.dataTimeLine[i].startNumber <= currentTime && currentTime <= $scope.dataTimeLine[i].endNumber) {
                    $scope.fromFrame = formatTime($scope.dataTimeLine[i].startNumber);
                    $scope.toFrame = formatTime($scope.dataTimeLine[i].endNumber);
                    $scope.currentSection = {
                        start: $scope.dataTimeLine[i].startNumber,
                        end: $scope.dataTimeLine[i].endNumber,
                        products: $scope.dataTimeLine[i].products,
                        id: $scope.dataTimeLine[i].id,
                        content: $scope.dataTimeLine[i].content,
                        url: $scope.dataTimeLine[i].url
                    };
                    timeline.setSelection($scope.currentSection.id, {
                        focus: true
                    });
                }
            }

            setStatusProduct();
            $("#navFrame").getNiceScroll(0).doScrollLeft(currentTime * 152, 100);
            $scope.$apply();
        };

        $scope.recipe = function () {
            CampaignModuleModel.setRecipe($scope.campaign.custom);
            $state.go('home.brandDetails.recipe');
        };

        //------------------------------Event for products----------------------------------
        $scope.showProductDetail = function (product, e) {
            e.preventDefault();
            e.stopPropagation();
            var indexList = listAllProducts.indexOf(product);
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
                    viewOnly: function () {
                        return false;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                //Update
                listAllProducts[indexList] = result;
                if (indexSelected > -1) $scope.listSelectedProducts[indexSelected] = result;
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.viewProductDetail = function (product, e) {
            e.preventDefault();
            e.stopPropagation();
            var indexList = listAllProducts.indexOf(product);
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
                    viewOnly: function () {
                        return true;
                    }
                }
            });
            modalInstance.result.then(function (result) {
                //Update
                listAllProducts[indexList] = result;
                if (indexSelected > -1) $scope.listSelectedProducts[indexSelected] = result;
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.selectProductToLink = function (product, e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }

            if ($scope.currentSection.start !== -1) {
                for (var i = 0; i < $scope.currentSection.products.length; i++) {
                    if ($scope.currentSection.products[i].id === product.id) return
                }
                if ($scope.currentSection.products.length === 0) {
                    $scope.currentSection.products.push(angular.copy(product));
                    $scope.currentSection.products[0].type = 'main';
                } else {
                    $scope.currentSection.products.push(angular.copy(product));
                }
                for (var i = $scope.currentSection.start; i <= $scope.currentSection.end; i++) {
                    $scope.triggerItems[i].isEdit = true;
                    $scope.triggerItems[i].products = $scope.currentSection.products;
                }

                for (var i = 0; i < $scope.dataTimeLine.length; i++) {
                    if ($scope.dataTimeLine[i].id === $scope.currentSection.id) {
                        $scope.dataTimeLine[i].products = $scope.currentSection.products;
                    }
                }

                product.isSelected = true;
                setStatusProduct();
            }
        };

        $scope.unSelectProductToLink = function (product, e) {
            e.preventDefault();
            e.stopPropagation();
            if ($scope.currentSection.start !== -1) {
                var flagMain = false;
                for (var i = 0; i < $scope.currentSection.products.length; i++) {
                    if ($scope.currentSection.products[i].id === product.id) {
                        if ($scope.currentSection.products[i].type === 'main') {
                            flagMain = true;
                        }
                        $scope.currentSection.products.splice(i, 1);
                        if (flagMain === true && $scope.currentSection.products.length > 0) {
                            $scope.currentSection.products[0].type = 'main';
                        }
                        break;
                    }
                }
                for (var i = $scope.currentSection.start; i <= $scope.currentSection.end; i++) {
                    $scope.triggerItems[i].isEdit = true;
                    $scope.triggerItems[i].products = $scope.currentSection.products;
                }
                for (var i = 0; i < $scope.dataTimeLine.length; i++) {
                    if ($scope.dataTimeLine[i].id === $scope.currentSection.id) {
                        $scope.dataTimeLine[i].products = $scope.currentSection.products;
                    }
                }

                product.isSelected = false;
                setStatusProduct();
            }
        };

        $scope.setMainProduct = function (product, e) {
            e.preventDefault();
            e.stopPropagation();
            for (var i = 0; i < $scope.currentSection.products.length; i++) {
                if (product.id === $scope.currentSection.products[i].id) {
                    $scope.currentSection.products[i].type = 'main';
                } else {
                    $scope.currentSection.products[i].type = 'similar';
                }
            }

            for (var i = $scope.currentSection.start; i <= $scope.currentSection.end; i++) {
                $scope.triggerItems[i].isEdit = true;
                $scope.triggerItems[i].products = $scope.currentSection.products;
            }
        };

        $scope.plusQuantity = function (product, e) {
            e.preventDefault();
            e.stopPropagation();
            product.quantity++;
            for (var i = 0; i < $scope.currentSection.products.length; i++) {
                if ($scope.currentSection.products[i].id === product.id) {
                    $scope.currentSection.products[i].quantity++;
                }
            }
            for (var i = $scope.currentSection.start; i <= $scope.currentSection.end; i++) {
                if ($scope.triggerItems[i]) {
                    $scope.triggerItems[i].isEdit = true;
                    $scope.triggerItems[i].products = $scope.currentSection.products;
                }
            }
        };

        $scope.subQuantity = function (product, e) {
            e.preventDefault();
            e.stopPropagation();
            if (product.quantity === 1) return;
            product.quantity--;
            for (var i = 0; i < $scope.currentSection.products.length; i++) {
                if ($scope.currentSection.products[i].id === product.id) {
                    $scope.currentSection.products[i].quantity--;
                }
            }
            for (var i = $scope.currentSection.start; i <= $scope.currentSection.end; i++) {
                if ($scope.triggerItems[i]) {
                    $scope.triggerItems[i].isEdit = true;
                    $scope.triggerItems[i].products = $scope.currentSection.products;
                }
            }
        };

        $scope.currentProductPage = 1;
        $scope.itemsPerPage = 12;
        $scope.maxPages = 4;

        $scope.changeProductPage = function () {
            // Change the display page on current page changed
            changeProductPage();
        };

        $scope.filterByKeyword = function () {
            // Reset current page, change the filtered products and display page on user input changed
            $scope.currentProductPage = 1;
            changeProductPage();
        };

        //-------------------------Navigation view-------------------------------
        $scope.multiSelect = -1;
        $scope.selectTriggers = function (index, trigger, event) {
            for (var i = 0; i < $scope.triggerItems.length; i++) {
                $scope.triggerItems[i].isSelected = false;
            }

            if (index === $scope.multiSelect) {
                $scope.multiSelect = -1;
                return;
            }
            //Single
            $scope.triggerItems[index].isSelected = true;
            //$scope.fromFrame = formatTime(index);
            //$scope.toFrame = formatTime(index);
            //Multiple
            if (event.shiftKey && $scope.multiSelect !== -1) {
                if ($scope.multiSelect < index) {
                    $scope.fromFrame = formatTime($scope.multiSelect);
                    $scope.toFrame = formatTime(index);
                    for (var i = $scope.multiSelect; i < index; i++) {
                        $scope.triggerItems[i].isSelected = true;
                    }
                } else {
                    $scope.fromFrame = formatTime(index);
                    $scope.toFrame = formatTime($scope.multiSelect);
                    for (var i = index; i < $scope.multiSelect; i++) {
                        $scope.triggerItems[i].isSelected = true;
                    }
                }
            } else {
                var flag = false;
                //Select item on timeline
                for (var i = 0; i < $scope.dataTimeLine.length; i++) {
                    if (index >= $scope.dataTimeLine[i].startNumber && index <= $scope.dataTimeLine[i].endNumber) {
                        flag = true;
                        var start = $scope.dataTimeLine[i].startNumber;
                        var end = $scope.dataTimeLine[i].endNumber;
                        $scope.fromFrame = formatTime(start);
                        $scope.toFrame = formatTime(end);
                        $scope.currentSection = {
                            start: start,
                            end: end,
                            products: $scope.dataTimeLine[i].products,
                            id: $scope.dataTimeLine[i].id,
                            content: $scope.dataTimeLine[i].content,
                            url: $scope.dataTimeLine[i].url
                        };
                        setStatusProduct();
                        timeline.setSelection($scope.dataTimeLine[i].id, {
                            focus: true
                        });
                    }
                }
                if (flag === false) {
                    resetSelection();
                }
            }

            $scope.multiSelect = index;
        };

        $scope.formatTime = function (number) {
            return formatTime(number);
        };

        $scope.fromStringFromFrameTime = function () {
            var fromFrame = (new Date($scope.fromFrame * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/);
            if (fromFrame && fromFrame[0]) $scope.fromFrame = fromFrame[0];
        };

        $scope.fromStringToFrameTime = function () {
            var toFrame = (new Date($scope.toFrame * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/);
            if (toFrame && toFrame[0]) $scope.toFrame = toFrame[0];
        };

        //------------------------------------Timeline---------------------------------

        var items = new vis.DataSet({
            type: {
                start: 'ISODate',
                end: 'ISODate'
            }
        });

        // add items to the DataSet
        items.clear();
        var container = document.getElementById('visualization');
        var options = {
            start: '0000-01-01',
            end: formatTimeLine(25),
            height: '200px',
            min: '0000-01-01',
            max: formatTimeLine(Math.round($scope.triggerItems.length)),
            zoomMin: 1000 * 60 * 60 * 24 * 31 * 12 * 3, // one day in milliseconds
            editable: true,
            showCurrentTime: true,
            showMajorLabels: false,
            showMinorLabels: true,
            format: {
                minorLabels: {
                    year: 'Y'
                }
            },
            snap: null,
            onRemove: function (item, callback) {
                PopupMessageService.showConfirmMessage("Are you sure you want to delete those section?", true, null, function () {
                    deleteSection(item);
                });
            },
            onMove: function (item, callback) {
                PopupMessageService.showConfirmMessageWithCancel("Are you sure you want to edit this section?", true, null, function () {
                    var isItemRightMoved = isSectionChanged(item.start);
                    var isItemLeftMoved = isSectionChanged(item.end);

                    var newStartPos = getPositionTimeLine(item.start, false);
                    var newEndPos = getPositionTimeLine(item.end, false);

                    if (isItemLeftMoved && !isItemRightMoved) {
                        // Resize section to the left ==> Adjust the new start pos to fix a bug of visjs
                        newStartPos = item.startNumber;
                    }

                    var maxVideoLength = Math.round($scope.video.duration);
                    newEndPos = newEndPos > maxVideoLength ? maxVideoLength : newEndPos;

                    $scope.fromFrame = formatTime(newStartPos);
                    $scope.toFrame = formatTime(newEndPos);
                    $scope.updateSection(true);
                }, function () {
                    items.update($scope.dataTimeLine);
                });
            },
            onAdd: function (item, callback) {
                PopupMessageService.showConfirmMessage("Are you sure you want to new section?", true, null, function () {
                    var startPos = getPositionTimeLine(item.start, false);
                    $scope.fromFrame = formatTime(startPos);
                    $scope.toFrame = formatTime(startPos);
                    $scope.updateSection(false);
                });
            }
        };

        var timeline = new vis.Timeline(container, items, options);

        timeline.on('select', function (properties) {
            for (var i = 0; i < $scope.triggerItems.length; i++) {
                $scope.triggerItems[i].isSelected = false;
            }
            for (var i = 0; i < $scope.dataTimeLine.length; i++) {
                if ($scope.dataTimeLine[i].id === properties.items[0]) {
                    var start = $scope.dataTimeLine[i].startNumber;
                    var end = $scope.dataTimeLine[i].endNumber;
                    $scope.fromFrame = formatTime(start);
                    $scope.toFrame = formatTime(end);
                    $scope.currentSection = {
                        start: start,
                        end: end,
                        products: $scope.dataTimeLine[i].products,
                        id: properties.items[0],
                        content: $scope.dataTimeLine[i].content,
                        url: $scope.dataTimeLine[i].url
                    };
                    setStatusProduct();
                    for (var j = start; j <= end; j++) {
                        $scope.triggerItems[j].isSelected = true;
                    }
                    $("#navFrame").getNiceScroll(0).doScrollLeft(start * 152, 100);
                    $scope.$apply();
                    return;
                }
            }
            resetSelection();

            $scope.$apply();
        });

        $scope.setPageUrl = function (flag) {
            $scope.setPage = flag;
        };

        $scope.nextStep = function () {
            CampaignModuleModel.setCampaign($scope.campaign);
            CampaignModuleModel.setTriggerItems($scope.triggerItems);
            CampaignModuleModel.setDataTimeLine($scope.dataTimeLine);
            $scope.campaign.custom ? $scope.recipe() : $state.go('home.brandDetails.createCampaignDetails');
        };

        $scope.previousStep = function () {
            CampaignModuleModel.setTriggerItems($scope.triggerItems);
            $state.go('home.brandDetails.createCampaignSetTrigger');
        };

        $scope.updateSection = function (flag) {
            var patt = new RegExp("([0-9][0-9]):([0-6][0-9]):([0-6][0-9])");
            if (patt.test($scope.fromFrame) && patt.test($scope.toFrame)) {
                var startFrom = getSecondsFromData($scope.fromFrame);
                var endTo = getSecondsFromData($scope.toFrame);
                if (flag === true) {
                    // Update selected section
                    updateSection($scope.currentSection, startFrom, endTo);
                    timeline.setSelection($scope.currentSection.id, {
                        focus: true
                    });
                } else {
                    // Add a new section
                    if (startFrom < 0 || endTo >= Math.round($scope.video.duration)) {
                        PopupMessageService.showAlertMessage("Please select range from 0 to video of length", false);
                        return;
                    }

                    var startConflicted = _.find($scope.dataTimeLine, function(data) {
                       return startFrom >= data.startNumber && startFrom <= data.endNumber;
                    });

                    var endConflicted = _.find($scope.dataTimeLine, function(data) {
                        return endTo >= data.startNumber && endTo <= data.endNumber;
                    });

                    if (startConflicted || endConflicted) {
                        PopupMessageService.showAlertMessage("Please select empty section", false);
                        items.clear();
                        items.update($scope.dataTimeLine);
                        $scope.fromFrame = formatTime($scope.currentSection.start);
                        $scope.toFrame = formatTime($scope.currentSection.end);
                        return false;
                    }

                    //For navigation
                    for (var i = startFrom; i <= endTo; i++) {
                        $scope.triggerItems[i].isSelected = true;
                    }

                    //updatePosNavigation(startFrom);
                    $scope.video.currentTime = startFrom;

                    $scope.currentSection = {
                        start: startFrom,
                        end: endTo,
                        products: [],
                        id: $scope.idDataTimeLine,
                        content: 'SECTION ' + $scope.idDataTimeLine,
                        url: ""
                    };
                    $scope.dataTimeLine.push({
                        id: $scope.idDataTimeLine,
                        content: 'SECTION ' + $scope.idDataTimeLine,
                        start: formatTimeLine(startFrom),
                        end: formatTimeLine(endTo + 1),
                        startNumber: startFrom,
                        endNumber: endTo,
                        products: [],
                        url: ""
                    });
                    items.update($scope.dataTimeLine);
                    timeline.setSelection($scope.idDataTimeLine, {
                        focus: true
                    });
                    $scope.idDataTimeLine++;
                }
            }
            return true;
        };

        $scope.updateSectionUrl = function () {
            for (var i = 0; i < $scope.dataTimeLine.length; i++) {
                if ($scope.dataTimeLine[i].id === $scope.currentSection.id) {
                    $scope.dataTimeLine[i].url = $scope.currentSection.url;
                    for (var j = $scope.dataTimeLine[i].startNumber; j <= $scope.dataTimeLine[i].endNumber; j++) {
                        $scope.triggerItems[j].url = $scope.currentSection.url;
                        $scope.triggerItems[j].isEdit = true;
                    }
                }
            }
        };

        $scope.deleteSection = function () {
            PopupMessageService.showConfirmMessage("Are you sure you want to delete this section?", true, null, function () {
                var data = angular.copy($scope.currentSection);
                data.startNumber = data.start;
                data.endNumber = data.end;
                deleteSection(data);
            });
        };

        $scope.move = function (percentage) {
            var range = timeline.getWindow();
            var interval = range.end - range.start;

            timeline.setWindow({
                start: range.start.valueOf() - interval * percentage,
                end: range.end.valueOf() - interval * percentage
            });
        };

        $scope.zoom = function (percentage) {
            var range = timeline.getWindow();
            var interval = range.end - range.start;
            console.log(range, interval);
            timeline.setWindow({
                start: range.start.valueOf() - interval * percentage,
                end: range.end.valueOf() + interval * percentage
            });
            //console.log(range.start.valueOf() - interval * percentage, range.end.valueOf()   + interval * percentage);
        };

        getALLProducts();

        initDataTimeLine();

        timeline.addCustomTime(formatTimeLine(0));
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
        $scope.page_per = 1;
        $scope.isLoading = false;

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
                        $scope.displayProducts.unshift(res.product);
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
