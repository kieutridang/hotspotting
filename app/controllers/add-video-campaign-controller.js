(function (angular, _) {
    'use strict';

    var controllers = angular.module('controllers');

    controllers.controller('AddVideoCampaignController', function ($scope, $rootScope, $sce, $state, $stateParams,
        $localStorage, $timeout, CampaignService, BrandService, PopupMessageService, AuthService, FileUploader, $http, $q) {

        $scope.brandId = parseInt($stateParams.brandId);

        BrandService.getList({}).then(function (brands) {
            $scope.brands = brands;
            if ($scope.brandId) {
                $scope.brandSel = _.find($scope.brands, function (item) {
                    return item.id == $scope.brandId;
                });
            } else if (brands.length > 0) {
                $scope.brandSel = brands[0];
            }
        });

        $scope.selectBrand = function (brand) {
            $scope.brandSel = brand;
        }

        $scope.campaignModel = {
            file_name: "",
            title: "",
            //url: "http://getbootstrap.com/css",
            url: "",
        };
        $scope.errorSize = false;

        //Upload file config
        var FILE_SIZE_LIMIT = 250 * 1024 * 1024;

        var authorizationHeader = $http.defaults.headers.common['Authorization'];
        var uploader = $scope.uploader = new FileUploader({
            url: CampaignService.getUploadVideoUrl(),
            autoUpload: false,
            alias: 'content',
            headers: {
                Authorization: authorizationHeader,
                Accept : 'application/vnd.ulab.v0+json'
            },
            formData: []
        });

        //FILTERS
        uploader.filters.push({
            name: 'fileSizeFilter',
            fn: function (item /*{File|FileLikeObject}*/, options) {
                if (item.size > FILE_SIZE_LIMIT) {
                    $scope.errorSize = true;
                    PopupMessageService.showAlertMessage("Maximum file size 250mb.", false);
                    return false;
                } else {
                    $scope.errorSize = false;
                }

                return true;
            }
        });

        $scope.uploadFileItem;

        uploader.onAfterAddingFile = function (fileItem) {
            console.info('onAfterAddingFile', fileItem);
            $scope.uploadFileItem = fileItem;
        };

        uploader.onBeforeUploadItem = function (item) {
            console.info('onBeforeUploadItem', item);

            var formData = item.formData;

            //var file = $('#media-file')[0].files[0];
            //formData.push({ "content": file });
            formData.push({ "file_name": $scope.uploadFileItem.file.name });
            formData.push({ "brandID": $scope.brandSel.id });
            formData.push({ "type": 'video' });
            formData.push({"title": $scope.campaignModel.title});
            formData.push({"url": $scope.campaignModel.url});

            var currentUser = AuthService.getCurrentUser();
            formData.push({"email": currentUser.email});
            formData.push({ "password": currentUser.password });
        };
        
        uploader.onProgressItem = function (fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
            //if (progress >= 99) fileItem.progress = 99;
        };

        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            if (status == 200) {
                var campaign = response.campaign;
                $localStorage.campaignVideo = campaign;
                createTriggersForVideo(campaign);
                
                PopupMessageService.showAlertMessage("Create campaign successfully", true);
            }
        };
        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);

            fileItem.cancel();
            $scope.isProcessing = false;
            $scope.errorStatus = true;
            var errorMessage = "Can not create video campaign. Please try again."
            PopupMessageService.showAlertMessage(errorMessage, false);
        };

        $scope.createVideoCampaign = function (addVideoCampaignForm) {
            addVideoCampaignForm.$setSubmitted();
            if (!addVideoCampaignForm.$valid || !$scope.uploadFileItem) return;

            $scope.isProcessing = true;
            $scope.uploadFileItem.upload();
        }

   
        $scope.changeFrameUrl = function (url) {
            $scope.campaignModel.url = url;
        }

        $scope.trustSrc = function (src) {
            return $sce.trustAsResourceUrl(src);
        }

      
        function createTriggersForVideo(campaign) {
            var deferred = $q.defer();

            var frameInfo = CampaignService.getFrames(campaign);
            var fromFrame = frameInfo.fromFrame,
                toFrame = frameInfo.toFrame;
            
            var data = {
                campaignID: campaign.id,
                url: campaign.url,
                start: fromFrame,
                end: toFrame
            };

            CampaignService.createTriggerMedia(data).then(function (result) {
                var triggers = result;
                $rootScope.globals.createTriggersForVideo = result;
                $state.go('home.brandDetails.editVideoCampaign', { id: campaign.id });
                deferred.resolve(triggers);
            }, function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        }

    
    });


})(angular, _);


