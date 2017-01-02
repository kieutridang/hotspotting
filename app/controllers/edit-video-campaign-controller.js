(function (angular, _) {
    'use strict';

    var controllers = angular.module('controllers');

    controllers.controller('EditVideoCampaignController', function ($rootScope, $scope, $sce, $state,
        $stateParams, $localStorage, $timeout, $interval,$filter, $uibModal, CampaignService, BrandService, PopupMessageService, ProductService) {

        $scope.dynamicPopover = {
            templateUrl: 'editUrlTemplateUrl.html',
        };

        $scope.video = null;

        var getSecondsFromData = function(data){
          var array = data.split(":");
          if(array.length === 3) {
            var second = Number(array[2]);
            var minutes = Number(array[1]);
            var hours = Number(array[0]);
            return second + minutes * 60 + hours *60;
          }
          return 0;
        }

        $scope.associateFrom = null;
        $scope.associateTo = null;
        $scope.associateProductManual = function() {
          $scope.selectFramed = [];
          var min = getSecondsFromData($scope.associateFrom);
          var max = getSecondsFromData($scope.associateTo);
          if(max > Math.round($scope.video.duration)) {
            PopupMessageService.showAlertMessage("Time is not over max length video", false);
          } else {
            gotoFrameAndVideo(min);
            if(checkFramesHaveTriggers(min, max)) {
              for(var i = min; i <= max; i++) {
                $scope.listFrame[i].isSelected = true;
                $scope.selectFramed.push($scope.listFrame[i]);
              }

              var modalInstance = $uibModal.open({
                  animation: true,
                  templateUrl: 'views/common/modal-list-associate-product.html',
                  // size: 'sm',
                  windowClass: "modal-associate-product",
                  // backdrop: 'static',
                  controller: 'AssociateProductController',
                  resolve: {
                    triggers: function () {
                      return $scope.selectFramed;
                    }
                  }
                });
                modalInstance.result.then(function (results) {
                  // product = results;
                }, function () {
                  console.log('Modal dismissed at: ' + new Date());
                  getTriggers();
                });
            }
          }
        }

        var campaignVideo = $localStorage.campaignVideo;
        $scope.campaignVideo = campaignVideo;
        var stop;
        $scope.listFrame = [];
        $scope.loadListFrame = function () {
            if ($scope.campaignVideo.start_frame) {
                var data = $scope.campaignVideo;
                initEditFrame($scope.campaignVideo.image_url, data.start_frame);
            } else {
                initEditFrame($scope.campaignVideo.image_url, $scope.campaignVideo.frame_url);
            }
        }

        var checkFramesHaveTriggers = function (min, max) {
          var flag = true;
          for(var i = 0; i < $scope.listFrame.length; i++) {
            $scope.listFrame[i].isSelected = false;
            if(i >= min && i <= max && $scope.listFrame[i].url === "" && $scope.listFrame[i].uuid === "" && flag === true) {
              $scope.selectFrame(i, $scope.listFrame[i]);
              flag = false;
            }
          }
          return flag;
        }

        $scope.loadListFrame();

        function initEditFrame(urlVideo, urlImage) {
            $scope.mySrc = $sce.trustAsResourceUrl(urlVideo);
            var lengthVideo;
            var videoC = $interval(function () {
                $scope.video = document.getElementById("videoCampain");
                if ($scope.video.duration) {
                    $interval.cancel(videoC);
                    lengthVideo = Math.round($scope.video.duration);
                    $scope.timeOutVideo = (new Date(lengthVideo * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];

                    $scope.video.addEventListener('play', function (e) {
                        stop = $interval(function () {
                            var mRound = Math.round($scope.video.currentTime);
                            $scope.currentSet = $scope._Index = mRound;
                            $scope.isActive(mRound);
                        }, 100)
                    });

                    $scope.video.ontimeupdate = function() {
                      var second = Math.round($scope.video.currentTime);
                      $("#columnTimeLine").css({left: second * $("#visualization").width() / lengthVideo});
                      $("#navFrame").getNiceScroll(0).doScrollLeft(second * 152, 100);
                    }

                    var objImg = getObjImgage(urlImage);

                    for (var i = 0; i < lengthVideo; i++) {
                        $scope.listFrame.push({
                            id: i,
                            src: objImg.strCat + '-' + i + '.' + objImg.extension,
                            isSelected: false,
                            url: "",
                            uuid: "",
                            popover: {
                                form: {},
                                formName : 'updateFrameRangeURLForm-' +i,
                                isProcessing: false,
                                isShowPopover : false,
                            }
                        });
                    };

                    $timeout(function () {
                        $("#navFrame").niceScroll({
                            "railvalign": "bottom"
                        });
                    }, 100);

                    getTriggers();
                }
            }, 1000);
        }

        function getObjImgage(urlImage) {
            var arrStart = urlImage.split("-");
            var strCat = urlImage.substring(0, urlImage.length - arrStart[arrStart.length - 1].length - 1);
            var objLastStart = arrStart[arrStart.length - 1];
            var arrObjLastStart = objLastStart.split(".");

            var objImg = {
                strCat: strCat,
                extension: arrObjLastStart[1]
            }

            return objImg;
        }

        $scope.getCurrentTimeFrame = function (ctime) {
            var date = new Date(ctime * 1000);
            var mm = date.getUTCMinutes();
            var ss = date.getSeconds();
            if (mm < 10) { mm = "0" + mm; }
            if (ss < 10) { ss = "0" + ss; }
            var t = mm + ":" + ss;
            return t;
        }
        $scope.showNavigationFrame = true;
        $scope.playBack = function() {
          $scope.showNavigationFrame = false;
          //vid.currentTime = 0;
          $scope.video.play();
          $scope.video.ontimeupdate = function() {
            var index = Math.round($scope.video.currentTime);
            $("#columnTimeLine").css({left: index * 12.3});
            for(var i = 0; i < $scope.triggerList.length; i++) {
              if($scope.listFrame[index].uuid === $scope.triggerList[i].id) {
                $scope.productSelecteds = $scope.triggerList[i].products;
                return;
              }
            }
          }
          $scope.video.onended = function() {
            $scope.showNavigationFrame = true;
          }
        }

        $scope.dataTimeLine = [];
        $scope.stopPlayBack = function() {
          $scope.showNavigationFrame = true;
          $scope.video.pause();
        }

        var items = new vis.DataSet({
          type: { start: 'ISODate', end: 'ISODate' }
        });

        var timeline = null;

        function getTriggers() {
            var params = {
              campaignID: campaignVideo.id,
              isGetProduct: 1
            };
            CampaignService.getTriggers(params).then(function (triggerList) {
                $scope.triggerList = triggerList;

                _.each($scope.triggerList, function (itemTrigger) {
                    _.each($scope.listFrame, function (itemFrame) {
                        if (itemTrigger.image_url == itemFrame.src) {
                            itemFrame.status = "active";
                            itemFrame.url = itemTrigger.url;
                            itemFrame.uuid = itemTrigger.id
                            itemFrame.products = itemTrigger.products;
                            if(itemFrame.isSelected === true) {
                              $scope.productSelecteds = itemTrigger.products;
                            }
                        }
                    })
                });
                $scope.dataTimeLine = [];
                //GetDataTimeLine
                var content = '';
                var product = {};
                var mainContent = '';
                for(var i = 0; i < $scope.listFrame.length - 1; i++) {
                  for(var j = i; j < $scope.listFrame.length; j++) {
                    if($scope.listFrame[i].products && $scope.listFrame[i].products.length > 0
                      && !checkedInforProducts($scope.listFrame[i].products, $scope.listFrame[j].products)) {
                      product = {id: i, content: '',start: formatTimeLine(i), end: formatTimeLine(j), products: $scope.listFrame[i].products, fromFrame: i, toFrame: j - 1};
                      for(var k = 0; k < $scope.listFrame[i].products.length; k++) {
                        if($scope.listFrame[i].products[k].type === 'main') {
                            mainContent = '<img src="'+ $scope.listFrame[i].products[k].image_url +'" style="width:32px; height:32px;">';
                        } else {
                          content += '<img src="'+ $scope.listFrame[i].products[k].image_url +'" style="width:32px; height:32px;">';
                        }
                      }
                      if(content !== '') {
                        product.content += '<div>...</div>';
                      }
                      product.content += mainContent + content;
                      $scope.dataTimeLine.push(product);
                      content = '';
                      mainContent = '';
                      i = j;
                    }
                  }
                }


                var countFrhasUrl = $filter("filter")($scope.listFrame, { status: "active" }).length;
                $scope.trainingInProgress = countFrhasUrl > 0 ? false : true;

               // add items to the DataSet
               items.clear();
               items.update($scope.dataTimeLine);
               var container = document.getElementById('visualization');
               var options = {
                 start: '0000-01-01',
                 end: formatTimeLine(Math.round(60)),
                 height: '250px',
                 // allow selecting multiple items using ctrl+click, shift+click, or hold.
                 multiselect: true,
                 zoomMin: 1000 * 60 * 60 * 24 * 31 * 12 * 3 ,             // one day in milliseconds
                 zoomMax: 1000 * 60 * 60 * 24 * 31 * 12 * 60, // about 60 years in milliseconds
                 // allow manipulation of items
                 editable: true,

                 showCurrentTime: true,

                 onRemove: function (item, callback) {
                  PopupMessageService.showConfirmMessage("Are you sure you want to delete those triggers?", true, null, function(){
                    $scope.removeTriggerMediaUrl(null, $scope.selectFramed[$scope.selectFramed.length - 1], null);
                    items.remove(item);
                  });
                },

                onMove: function(item, callback) {
                  PopupMessageService.showConfirmMessageWithCancel("Are you sure you want to edit this triggers?", true, null, function(){
                    var min = getPositionTimeLine(item.start, true);
                    var max = getPositionTimeLine(item.end, false);
                    if(checkRangeIsValid(min, max, item) && checkFramesHaveTriggers(min, max)) {
                      updateProductIntoTriggers($scope.selectFramed, [], false);
                      $scope.selectFramed = [];
                      for(var i = min; i <= max; i++) {
                        $scope.listFrame[i].isSelected = true;
                        $scope.selectFramed.push($scope.listFrame[i]);
                      }
                      updateProductIntoTriggers($scope.selectFramed, item.products, true);
                    }
                  }, function() {
                    items.update($scope.dataTimeLine);
                  });
                }

               };

               if(timeline === null) {
                 timeline = new vis.Timeline(container, items, options);
               }

               timeline.on('select', function (properties) {
                 if(properties.items.length > 0) gotoFrameAndVideo(properties.items[0]);
                 for(var i = 0; i < $scope.dataTimeLine.length; i++) {
                   if(properties.items[0] === $scope.dataTimeLine[i].id) {
                     $scope.productSelecteds = $scope.dataTimeLine[i].products;
                     for(var j = 0; j < $scope.listFrame.length; j++) {
                       $scope.listFrame[j].isSelected = false;
                       if(j >= $scope.dataTimeLine[i].fromFrame && j <= $scope.dataTimeLine[i].toFrame) {
                         $scope.listFrame[j].isSelected = true;
                         $scope.selectFramed.push($scope.listFrame[j]);
                       }
                     }
                     $scope.$apply();
                     break;
                   }
                 }
               });
            }, function (err) {
                console.log(err);
            });
        }

        var gotoFrameAndVideo = function (second) {
          $("#navFrame").getNiceScroll(0).doScrollLeft(second * 152, 100);
          $scope.video.currentTime = second;
        }

        $scope.zoomTimeLine = function (percentage) {
          var range = timeline.getWindow();
          var interval = range.end - range.start;

          timeline.setWindow({
              start: range.start.valueOf() - interval * percentage,
              end:   range.end.valueOf()   + interval * percentage
          });
        }

        $scope.moveTimeLine = function (percentage) {
            var range = timeline.getWindow();
            var interval = range.end - range.start;

            timeline.setWindow({
                start: range.start.valueOf() - interval * percentage,
                end:   range.end.valueOf()   - interval * percentage
            });
        }

        var updateProductIntoTriggers = function(triggers, products, showMessage) {
          var productIds = _(products).pluck("id").value().join(",");
          //if(productIds.length <= 0 ) productIds = ;

          var typeList = '';
          var tmp = 0;
          var selectedList = _.filter(products, { selected: true });

          _.forEach(products, function(product){
              var type = product.type;
              typeList += tmp == 0  ? type : ',' + type ;
              tmp++;
          });

          var query = {
            triggerID: _(triggers).pluck("uuid").value().join(","),
            productID_list: productIds,
            type_list: typeList
          };

          if(productIds.length <= 0) {
            query = {
              triggerID: _(triggers).pluck("uuid").value().join(",")
            };
          }
          ProductService.associateTriggerProduct(query).then(function(res){
            if(showMessage === true) {
              if (res.status_code == 200) {
                PopupMessageService.showAlertMessage("Associate successfull!", true);
                getTriggers();
              } else {
                PopupMessageService.showAlertMessage("Associate fail!", true);
              }
            }
          })
        }

        var checkedInforProducts = function(array1, array2) {
          var flag = false;
          if(array1 && array2 && array1.length === array2.length) {
            for(var i = 0; i < array1.length; i++) {
              for(var j = 0; j < array2.length; j++) {
                if(array1[i].id === array2[j].id) {
                  flag = true;
                  break;
                }
                flag = false;
              }
            }
          }
          return flag;
        }

        var checkRangeIsValid = function(min, max, item) {
          console.log($scope.dataTimeLine, min, max);
          for(var i = 0; i < $scope.dataTimeLine.length; i++) {
            if($scope.dataTimeLine[i].id !== item.id && (($scope.dataTimeLine[i].fromFrame > min && $scope.dataTimeLine[i].fromFrame <= max) ||
                ($scope.dataTimeLine[i].toFrame > min && $scope.dataTimeLine[i].toFrame <= max))) {
              PopupMessageService.showAlertMessage("Please select empty false", false);
              items.clear();
              items.update($scope.dataTimeLine);
              return false;
            }
          }
          return true;
        }

        var getPositionTimeLine = function(string, flagStart) {
          var array = string.split("-");
          if(array.length === 3) {
            return flagStart === true ? Number(array[0]) + 1 : Number(array[0]);
          } else if(array.length === 4) {
            return -Number(array[1]) + 1;
          } else {
            return 0;
          }
        }

        var formatTimeLine = function(number) {
          if(number < 10) {
            return '000' + number + '-01-01';
          } else if (number < 100) {
            return '00' + number + '-01-01';
          } else if (number < 1000) {
            return '0' + number + '-01-01';
          } else {
            return number + '-01-01';
          }
        }

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

        $scope._Index = 0;

        $scope.isActive = function (index) {
            return $scope._Index === index;
        };

        $scope.showPrev = function () {
            $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.photos.length - 1;
        };

        $scope.showNext = function () {
            $scope._Index = ($scope._Index < $scope.photos.length - 1) ? ++$scope._Index : 0;
        };

        $scope.selectFramed = [];
        $scope.currentFrameUrl = $scope.campaignVideo.url;

        $scope.lastFrame = null;
        $scope.productSelecteds = [];
        $scope.selectFrame = function (index, frame) {
            var lastFrame = $scope.lastFrame;
            $scope.selectMultiFrame(index, frame);
            if(!_.isUndefined($scope.selectFramed)){
                $scope.statusListTrigger = true;
                _.forEach($scope.selectFramed, function(frame){
                    if(frame.url.length <= 0 )
                        $scope.statusListTrigger = false;
                })
            }
            if(!lastFrame || lastFrame === frame) {
              $scope.productSelecteds = frame.products;
            } else {
              $scope.productSelecteds = [];
            }
        };

        $scope.selectMultiFrame = function(index, frame){
            if (!$scope.lastFrame) {
                $scope.lastFrame = frame;
            } else if ($scope.lastFrame != frame) {
                $scope.lastFrame.popover.isShowPopover = false;
                $scope.lastFrame = frame;
            } else {

            }

            frame.popover.isShowPopover = !frame.popover.isShowPopover;

            $scope.currentFrameUrl = frame.url;
            $interval.cancel(stop);
            $scope._Index = index;
            $scope.video.currentTime = frame.id;
            $scope.video.pause();

            if ($scope.selectFramed.length == 0) {
                frame.isSelected = true;
                $scope.selectFramed.push(frame);
            } else {
                var minFrame = $filter('orderBy')($scope.selectFramed, 'id')[0];
                var maxFrame = $filter('orderBy')($scope.selectFramed, '-id')[0];

                _.each($scope.listFrame, function (item) {
                    item.isSelected = false;
                });

                if (minFrame.id == maxFrame.id) {
                    if (minFrame.id <= frame.id) {
                        $scope.selectFramed = [];
                        for (var i = minFrame.id; i <= frame.id; i++) {
                            $scope.selectFramed.push($scope.listFrame[i]);
                            $scope.listFrame[i].isSelected = true;
                        }
                    } else {
                        $scope.selectFramed = [];
                        for (var i = frame.id; i < minFrame.id; i++) {
                            $scope.selectFramed.push($scope.listFrame[i]);
                            $scope.listFrame[i].isSelected = true;
                        }

                    }
                }

                if (minFrame.id < maxFrame.id) {
                    if (frame.id <= minFrame.id) {
                        $scope.selectFramed = [];
                        for (var i = frame.id; i <= minFrame.id; i++) {
                            $scope.selectFramed.push($scope.listFrame[i]);
                            $scope.listFrame[i].isSelected = true;
                        }
                    } else if (maxFrame.id <= frame.id) {
                        $scope.selectFramed = [];
                        for (var i = minFrame.id; i <= frame.id; i++) {
                            $scope.selectFramed.push($scope.listFrame[i]);
                            $scope.listFrame[i].isSelected = true;
                        }
                    } else if (minFrame.id < frame.id < maxFrame.id) {
                        $scope.selectFramed = [];
                        for (var i = minFrame.id; i <= frame.id; i++) {
                            $scope.selectFramed.push($scope.listFrame[i]);
                            $scope.listFrame[i].isSelected = true;
                        }
                    }
                }
            }
        }

        $scope.selectOneFrame  = function(index, fr){
           $scope.listFrame[index].isSelected = !$scope.listFrame[index].isSelected;

           if($scope.listFrame[index].isSelected)
           {
                 $scope.selectFramed.push($scope.listFrame[index]);
                _.forEach($scope.listFrame, function(frame){
                    frame.popover.isShowPopover = false;
                });
                fr.popover.isShowPopover = false;
           }
           else{
                $scope.selectFramed.unshift($scope.listFrame[index]);
                _.forEach($scope.listFrame, function(frame){
                    frame.popover.isShowPopover = false;
                });
            }

        };

        $scope.changeFrameUrl = function (frame) {
            $scope.currentFrameUrl = frame.url;
        }

        $scope.clearAllSelected = function(){
            _.forEach($scope.listFrame, function(frame){
                frame.isSelected = false;
                frame.popover.isShowPopover = false;
                frame.popover.isProcessing = false;
            });
            $scope.lastFrame = null;
            $scope.selectFramed = [];
            $scope.productSelecteds = [];
            items.clear();
            items.update($scope.dataTimeLine);
        }

        $scope.flagSelectMultiFrame = true;
        $scope.unselectMultiFrame = function(){
            $scope.flagSelectMultiFrame = !$scope.flagSelectMultiFrame;
            $scope.clearAllSelected();
        }

        $scope.createTriggerMediaUrl = function (updateFrameRangeURLForm, frame, $event) {
            $scope.errorStatus = false;
            if (!$scope.currentFrameUrl || !validateUrl($scope.currentFrameUrl)) {
                PopupMessageService.showAlertMessage("Please enter a valid url", false);
                return false;
            }

            frame.popover.isProcessing = true;

            var minFrame = $filter('orderBy')($scope.selectFramed, 'id')[0];
            var maxFrame = $filter('orderBy')($scope.selectFramed, '-id')[0];
            var data = {
                campaignID: $scope.campaignVideo.id,
                url: $scope.currentFrameUrl,
                start: minFrame.id,
                end: maxFrame.id
            };

            CampaignService.createTriggerMedia(data).then(function (result) {
                var triggers = result;


                _.each(triggers, function (itemTrigger) {
                    _.each($scope.listFrame, function (itemFrame) {
                        if (itemTrigger.image_url == itemFrame.src) {
                            itemFrame.status = "active";
                            itemFrame.url = itemTrigger.url;
                            itemFrame.uuid = itemTrigger.id
                        }
                    })
                })

                console.log(result);
                _.each($scope.listFrame, function (item) {
                    item.isSelected = false;
                });

                var countFrhasUrl = $filter("filter")($scope.listFrame, { status: "active" }).length;
                $scope.trainingInProgress = countFrhasUrl > 0 ? false : true;

                $scope.selectFramed = [];
                frame.popover.isShowPopover = false;
                frame.popover.isProcessing = false;
            }, function (err) {
                //frame.popover.isShowPopover = false;
                frame.popover.isProcessing = false;
                $scope.errorStatus = true;
                PopupMessageService.showAlertMessage(err, false);
            });
            // $scope.listFrameIds = _($scope.selectFramed).pluck("id").value().join(",");
        };

        $scope.removeTriggerMediaUrl = function (updateFrameRangeURLForm, frame, $event) {
            var items = $filter('filter')($scope.selectFramed, function (item) {
                return item.uuid != "";
            });
            var query = {
                triggerID_list: _(items).pluck("uuid").value().join(",")
            };

            if (items.length > 0) {

                frame.popover.isProcessing = true;

                CampaignService.deleteTrigger(query).then(function (res) {
                    console.log(res);
                    _.each($scope.selectFramed, function (itemFrame, idx) {
                        _.each($scope.listFrame, function (item, index) {
                            if (itemFrame.uuid == item.uuid) {
                                item.status = "";
                                item.url = "";
                                item.products = [];
                            }
                        })
                    });

                    _.each($scope.listFrame, function (item) {
                        item.isSelected = false;
                    });

                    var countFrhasUrl = $filter("filter")($scope.listFrame, { status: "active" }).length;
                    $scope.trainingInProgress = countFrhasUrl > 0 ? false : true;

                    $scope.selectFramed = [];
                    $scope.productSelecteds = [];
                    frame.popover.isShowPopover = false;
                    frame.popover.isProcessing = false;
                    getTriggers();
                })
            } else {
                if(frame) frame.popover.isShowPopover = false;

                _.each($scope.listFrame, function (item) {
                    item.isSelected = false;
                });

                $scope.selectFramed = [];
                $scope.productSelecteds = [];
            }
        };

        $scope.associateProduct = function(updateFrameRangeURLForm, frame, $event){
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/common/modal-list-associate-product.html',
                // size: 'sm',
                windowClass: "modal-associate-product",
                // backdrop: 'static',
                controller: 'AssociateProductController',
                resolve: {
                  triggers: function () {
                    return $scope.selectFramed;
                  }
                }
              });
              modalInstance.result.then(function (results) {
                // product = results;
              }, function (results) {
                console.log('Modal dismissed at: ' + new Date());
                getTriggers();
              });
        }
    });

   controllers.controller('AssociateProductController',
    function ($rootScope, $scope, $timeout, $uibModal, $uibModalInstance, ProductService, BrandService, CampaignService, PopupMessageService, triggers) {

        $scope.getProducts = getProducts();
        function getProducts(){
          $scope.productParams = {};
          ProductService.getProducts($scope.productParams).then(function (result) {
            $scope.products = _.map(result, function(item){
                var it = item;
                it.price = parseFloat(item.price)
                return it;
            });
            loadAssociatedProduct();
            $("#tableBodyScroll").niceScroll();
          });
        }


        $scope.reverse = true;
        $scope.order = order;
      function order(predicate) {
        $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
        $scope.predicate = predicate;
      };

      var associatedProductStore = {};
      $scope.associateTrigger = associateTrigger;
      function associateTrigger() {
        var productIds = _($scope.products).where({selected: true}).pluck("id").value().join(",");
        //if(productIds.length <= 0 ) return;

        var typeList = '';
        var tmp = 0;
        var selectedList = _.filter($scope.products, { selected: true });

        _.forEach(selectedList, function(product){
            var type = product.typeSelected == true ? 'main' : 'similar';
            typeList += tmp == 0  ? type : ',' + type ;
            tmp++;
        });

        var query = {
          triggerID: _(triggers).pluck("uuid").value().join(","),
          productID_list: productIds,
          type_list: typeList
        };

        if(productIds.length <= 0) {
          query = {
            triggerID: _(triggers).pluck("uuid").value().join(",")
          };
        }
        ProductService.associateTriggerProduct(query).then(function(res){
          if (res.status_code == 200) {
            PopupMessageService.showAlertMessage("Associate successfull!", true);
          } else {
            PopupMessageService.showAlertMessage("Associate fail!", true);
          }
        })

      }


      $scope.loadAssociatedProduct = loadAssociatedProduct;
      function loadAssociatedProduct(){
        if(!triggers){
          return;
        }

        var query = {
          triggerID: _(triggers).pluck("uuid").value().join(",")
        }
        console.log(_(triggers).pluck("uuid").value().join(","))

        ProductService.getProducts(query).then(function (result) {
            if(triggers.length <= 1){
               _.forEach($scope.products, function(product){
                _.forEach(result, function(item){
                    if(product.id == item.id){
                      product.selected = true;
                      product.typeSelected  = item.type =='main' ?  true: false;
                    }
                })
              })
            }
        });

      }

      $scope.handleTypeSelected = handleTypeSelected;
      function handleTypeSelected(product){
        var flag = product.typeSelected == false || _.isUndefined(product.typeSelected)  ? true: false;
        _.forEach($scope.products, function (item) {
            item.typeSelected = false;
        });
        product.typeSelected = flag;
      }

      $scope.isCheckedAllItems = false;
       $scope.toogleCheckAll = function () {
        _.forEach($scope.products, function (item) {
            item.selected = $scope.isCheckedAllItems;
        })

        $scope.productIds = _($scope.products).where({selected: true}).pluck("id").value().join(",");
        console.log("$scope.productIds --- " + $scope.productIds);
      };


      $scope.checkedProduct = function (){
        $scope.productIds = _($scope.products).where({selected: true}).pluck("id").value().join(",");
        $scope.productsChecked = _.filter($scope.products, {selected: true});
        if($scope.productsChecked.length == 1){
          _.forEach($scope.products, function(item){
            item.typeSelected  = false;
          })
          $scope.productsChecked[0].typeSelected = true;
        }
        console.log("$scope.productIds --- " + $scope.productIds);
      }

      $scope.deleteProductChecked = function(){
        var query = {
          email: currentUser.email,
          password: currentUser.password,
          productID_list: $scope.productIds
        };
        ProductService.delete(query).then(function(res){
          if (res.status_code == 200) {
            $scope.products = _.filter($scope.products, { selected: false });
             popupMessage(res.message, true);
          } else {
            popupMessage(res.message, false);
          }
        })

      }

      $scope.editProduct = function(product) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/common/modal-add-edit-product.html',
            // size: 'sm',
            windowClass: "modal-product",
            backdrop: 'static',
            controller: 'AddEditProductController',
            resolve: {
              product: function () {
                return product;
              },
              products: function(){
                return $scope.products;
              }
            }
          });
          modalInstance.result.then(function (results) {
            product = results;
          }, function () {
            console.log('Modal dismissed at: ' + new Date());
          });
      }

      $scope.confirmDeleteProduct = function(product) {
          $scope.deleteProduct = product;
          PopupMessageService.showConfirmMessage("Are you sure you want to delete this product.?", true, null, deleteProduct);
      }


      $scope.popupConfirmDeleteSelected = function(){
          PopupMessageService.showConfirmMessage("Are you sure you want to delete these products.?", true, null, deleteProductChecked);
      }


      $scope.deleteProduct = deleteProduct;
      function deleteProduct(){
        var cpId = $scope.deleteProduct.id;
        var query = {
          productID_list: cpId
        };
        ProductService.deleteProduct(query).then(function(res){
          if (res.status_code == 200) {
            angular.forEach($scope.products, function(obj, index){
                if (obj.id === $scope.deleteProduct.id) {
                    $scope.products.splice(index, 1);
                    return;
                };
            });
            PopupMessageService.showAlertMessage("Delete successfull!", true);

          } else {
            PopupMessageService.showAlertMessage("Delete fail!", true);

          }
        })
      }

      $scope.deleteProductChecked = deleteProductChecked;
      function deleteProductChecked(){
        var query = {
          productID_list: $scope.productIds
        };
        ProductService.deleteProduct(query).then(function(res){
          if (res.status_code == 200) {
            $scope.products = _.filter($scope.products, function(item){
                if(!item.selected)
                  return item;
            });
            PopupMessageService.showAlertMessage("Delete successfull!", true);
          } else {
            PopupMessageService.showAlertMessage("Delete fail!", true);
          }
        })

      }

      $scope.closeModal = function () {
          $uibModalInstance.dismiss('cancel');
      }


    });

    function validateUrl(value) {
        return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
    }


})(angular, _);
