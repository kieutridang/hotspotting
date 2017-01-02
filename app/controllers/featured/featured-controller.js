(function (angular, _) {
  'use strict';

  angular.module('productModule').controller('FeaturedController', ['$rootScope', '$scope', '$timeout', '$uibModal', 'ProductService', 'BrandService', 'CampaignService', 'PopupMessageService', 'ProductModuleModel',
    function ($rootScope, $scope, $timeout, $uibModal, ProductService, BrandService, CampaignService, PopupMessageService, ProductModuleModel) {
      $("#tableBodyScroll").niceScroll();

      $scope.getProducts = getProducts();
      $scope.featurePannel = {};
      $scope.productAssociate = [];
      $scope.isLoading = false;
      $scope.isSwap = false;
      listFeature();

      function listFeature() {
        ProductService.listFeature({}).then(function (result) {
          $scope.featurePannel = result.features[0];
        });
      }

      function getProducts(){
          $scope.productParams = {};
          ProductService.getProducts($scope.productParams).then(function (result) {
            $scope.products = result;
            if($scope.products.length > 0) $scope.productDetail = $scope.products[0];
            loadAssociatedProduct();
          });
      }

      var campaignStore = {};
      $scope.scrollLeft = function(){
        $('.list-img-to-link').scrollLeft(0);
      }
      $scope.viewDetail = function(product) {
        $scope.productDetail = product;
      }

      $scope.linkProduct = function(product) {
        product.selected = true;
        product.position = $scope.listProductSelected.length + 1;
        $scope.listProductSelected.push(product);
        $scope.isSwap = true;
      }

      $scope.unLinkProduct = function(product) {
        product.selected = false;
        for(var i = 0; i < $scope.listProductSelected.length; i++) {
          if($scope.listProductSelected[i].id === product.id) {
            $scope.listProductSelected.splice(i, 1);
            break;
          }
        }
        $scope.isSwap = true;
      }

      $scope.associateCampaign = associateCampaign;
      function associateCampaign() {
        $scope.isLoading = true;
        var productIds = _($scope.products).where({selected: true}).pluck("id").value().join(",");
        var positionList = _($scope.products).where({selected: true}).pluck("position").value().join(",");
        //if(productIds.length <= 0 ) return;

        var typeList = '';
        var tmp = 0;
        var selectedList = _.filter($scope.products, { selected: true });

        _.forEach(selectedList, function(product){
            var type = product.typeSelected == true ? 'main' : 'similar';
            typeList += tmp == 0  ? type : ',' + type ;
            tmp++;
        });

        //if($scope.campaignSel){
            var cpId = 223;
            var query = {
              campaignID: cpId,
              productID_list: productIds,
              type_list: typeList,
              position_list: positionList
            }

            if(productIds.length <= 0) {
  						delete query.type_list;
  						//delete query.productID_list;
              delete query.positionList;
            }

            ProductService.associateProduct(query).then(function(res){
              $scope.isLoading = false;
              if (res.status_code == 200) {
                PopupMessageService.showAlertMessage("Associate successfull!", true);
              } else {
                PopupMessageService.showAlertMessage("Associate fail!", true);
              }
            })
        //}

      }

      $scope.countProduct = 0;
      $scope.listProductSelected = [];
      function loadAssociatedProduct(){
        // if(!$scope.campaignSel){
        //   return;
        // }
        // var cpId = $scope.campaignSel.id;
        var cpId = 223;
        var query = {
          campaignID: cpId
        }

        ProductService.getProducts(query).then(function (result) {

            _.forEach($scope.products, function(product){
              product.selected = false;
              _.forEach(result, function(item){
                  if(product.id == item.id){
                    product.selected = true;
                    product.position = parseInt(item.position);
                    $scope.countProduct++;
                    product.typeSelected  = item.type =='main' ?  true: false;
                    $scope.listProductSelected.push(product);
                  }
              })
            })
            $scope.listProductSelected.sort(function(a, b) {
              if (a.position < b.position) return -1;
              if (b.position < a.position) return 1;
              return 0;
            });

        });
      }

      $scope.index01 = {};
      $scope.index02 = {};

      $scope.onDrop = function(index, product) {
        $scope.index02.index = index;
        $scope.index02.product = product;
      };

      $scope.onStop = function(index, product) {
        $scope.index01.index = index;
        $scope.index01.product = product;
        $scope.countProduct--;
        if($scope.index01.index !== $scope.index02.index && $scope.index01.product && $scope.index02.product && $scope.countProduct < 0 && $scope.isSwap === false) {
          $scope.index01.product.position = $scope.index02.index;
          $scope.index02.product.position = $scope.index01.index;
        }
        $scope.isSwap = false;
        $scope.index01.index = null;
        $scope.index02.index = null;
      };

      $scope.editFeature = function(){
        ProductModuleModel.setFeature($scope.featurePannel);
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/featured/modal-add-edit-feature.html',
            // size: 'sm',
            windowClass: "modal-product",
            backdrop: 'static',
            controller: 'AEDFeatureController'
          });
          modalInstance.result.then(function (results) {
            if(results){
              $scope.featurePannel = results;
              //$scope.$apply();
            }
          }, function () {
            console.log('Modal dismissed at: ' + new Date());
          });
      }

  }]);

})(angular, _);
