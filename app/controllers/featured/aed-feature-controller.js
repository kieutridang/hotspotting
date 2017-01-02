(function (angular, _) {
  'use strict';

var controllers = angular.module('controllers');

angular.module('productModule').controller('AEDFeatureController',
  function ($rootScope, $scope, $timeout, $uibModalInstance, ProductService, PopupMessageService, ProductModuleModel) {
      //Variable
      $scope.feature = angular.copy(ProductModuleModel.getFeature()) || {};
      $scope.isLoading = false;
      $scope.isChangeImage = false;
      $scope.updated_pos_list = [];
      $scope.deleted_pos_list = "";
      //convertImageFeature();
      //---------------------------------------Public function----------------------------------------------
      $scope.setFile = function (element) {
				var reader = new FileReader();
				var imageFile = element.files[0];
				reader.onload = function (e) {
          $scope.feature.images.push(e.target.result);
          $scope.updated_pos_list.push($scope.feature.images.length - 1);
          $scope.isChangeImage = true;
					$scope.$apply();
				};
				reader.readAsDataURL(imageFile);
  		};

      $scope.closeModal = function () {
        $uibModalInstance.dismiss('cancel');
      };

      $scope.removeImage = function(index) {
        //$scope.feature.images.splice(index, 1);
        $scope.feature.images[index] = "deleted";
        $scope.updated_pos_list.push(index);
        $scope.isChangeImage = true;
      }

      $scope.saveProduct = function(form){
        $scope.isLoading = true;
        var pro = angular.copy($scope.feature);
        if(!pro.images) pro.images = [];
        if(!pro.fileName) pro.fileName = [];
        pro.fileName = [];
        for(var i =0 ; i < pro.images.length; i++) {
          if(pro.images[i].indexOf("http://") > -1) {
            pro.images.splice(i, 1);
            i--;
            continue;
          }
          pro.fileName.push(Math.floor((Math.random() * 10) + 1) + '.png');
        }
        var query = {
          name: pro.name,
          description: pro.description || "",
          content_list: JSON.stringify(pro.images),
          filename_list: JSON.stringify(pro.fileName),
          updated_pos_list: JSON.stringify($scope.updated_pos_list),
        }

        if($scope.isChangeImage === false) {
          delete query.content_list;
          delete query.filename_list;
          delete query.updated_pos_list;
        }

        //if(!query.description) delete query.description;

        if (pro.file_name ) {
          query.image = pro.image_url;
          query.file_name = pro.file_name;
        }
        if ($scope.feature.id) {
          query.featureID = $scope.feature.id;
          ProductService.editFeature(query)
            .then(callback, callback);
        } else {
          ProductService.createFeature(query)
            .then(callback, callback);
        }
      };


      //----------------------------------------Private function----------------------------------------
      var callback = function(res) {
        $scope.isProcessing = false;
        if (res['status_code'] == "200") {
          PopupMessageService.showAlertMessage("Save successfull!", true);
          $uibModalInstance.close(res.feature);
        } else {
          var message = res && res.message ? res.message : "Save fail!";
          PopupMessageService.showAlertMessage(message, true);
        }
        $scope.isLoading = false;
      };
  });

})(angular, _);
