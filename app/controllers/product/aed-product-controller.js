(function (angular, _) {
  'use strict';

// var controllers = angular.module('controllers');

angular.module('productModule')
    .controller('AEDProductController', [
        '$rootScope',
        '$scope',
        '$timeout',
        '$uibModalInstance',
        'ProductService',
        'PopupMessageService',
        'ProductModuleModel',
        'viewOnly',
    function(
        $rootScope,
        $scope,
        $timeout,
        $uibModalInstance,
        ProductService,
        PopupMessageService,
        ProductModuleModel,
        viewOnly
    ) {
        //Variable
        $scope.product = angular.copy(ProductModuleModel.getProduct()) || {};
        $scope.viewOnly = viewOnly;

        //---------------------------------------Public function----------------------------------------------
        $scope.setFile = function (element) {
  				var reader = new FileReader();
  				var imageFile = element.files[0];
  				reader.onload = function (e) {
            $scope.product.image_url = e.target.result;
            $scope.product.file_name = imageFile.name;
  					$scope.$apply();
  				};
  				reader.readAsDataURL(imageFile);
    		};

        $scope.closeModal = function () {
          $uibModalInstance.dismiss('cancel');
        };

        $scope.saveProduct = function(form){
          // form.$setSubmitted();
          // if (!form.$valid) return;
          // if(!product.file_name && !$scope.product.id) return;
          //
          // $scope.isProcessing = true;
          var pro = $scope.product;
          var query = {
            title: pro.title,
            desc: pro.desc,
            price: pro.price,
            url: pro.url,
          }

          if (pro.file_name ) {
            query.image = pro.image_url;
            query.file_name = pro.file_name;
          }
          if ($scope.product.id) {
            query.productID = $scope.product.id;
            ProductService.editProduct(query)
              .then(callback, callback);
          } else {
            ProductService.createProduct(query)
              .then(callback, callback);
          }
        };

        $scope.deteteProduct = function() {
          ProductService.deleteProduct({productID_list: $scope.product.id}).then(function(res){
  					if (res.status_code == 200) {
  						PopupMessageService.showAlertMessage('Delete campaign successful!', true);
              $uibModalInstance.close(res);
  					}
          }, function (err) {
  					PopupMessageService.showAlertMessage(err, false);
  				});
        };


        //----------------------------------------Private function----------------------------------------
        var callback = function(res) {
          $scope.isProcessing = false;
          if (res['status_code'] == "200") {
            PopupMessageService.showAlertMessage("Save successfull!", true);
            $uibModalInstance.close(res.product);
          } else {
            var message = res && res.message ? res.message : "Save fail!";
            PopupMessageService.showAlertMessage(message, true);
          }
        };
    }]);

})(angular, _);
