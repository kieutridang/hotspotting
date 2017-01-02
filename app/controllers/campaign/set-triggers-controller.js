(function(angular, _) {
    'use strict';

    angular.module('campaignModule').controller('createCampaignSetTrigger', function($scope, $state, $stateParams, $location,
        $uibModal, $localStorage, $timeout, CampaignService, CampaignModuleModel, BrandService, PopupMessageService, NewCampaignTriggerViewModel,
        AuthService, FileUploader, $http, $q, $sce) {
        //Variable
        $scope.campaign = CampaignModuleModel.getCampaign() || {};
        $scope.triggerItems = CampaignModuleModel.getTriggerItems() || [];
        $scope.uploadFileItem;
        //Check is_training
        if ($scope.campaign.is_trainning === "1" && $scope.campaign.no_triggers === 0) {
            $scope.isLoading = true;
        } else {
            $scope.isLoading = false;
        }
        $scope.uploadInvalid = false;
        $scope.inCorrectFormat = false;
        $scope.isCreateTrigger = false;
        $scope.isWaitingTrigger = false;
        $scope.percentProcess = 0;

        if ($scope.campaign && $scope.campaign.type === 'video' && $scope.campaign.image_url) {
            if ($scope.campaign.custom && JSON.parse($scope.campaign.custom)[1]["recipe"] && JSON.parse($scope.campaign.custom)[1]["recipe"].length <= 0) $scope.campaign.custom = null;
            $("#videoCampain source").attr("src", $scope.campaign.image_url);
            $("#videoCampain")[0].load();
        }

        //-------------------------------------------------Public function----------------------------------------------
        $scope.setFile = function(element) {
            /*console.log(element.files);*/
            $scope.inCorrectFormat = false;
            for (var i = 0; i < element.files.length; i++) {
                var reader = new FileReader();
                var file = element.files[i];
                reader.onload = function(event) {
                    checkTypeTrigger(element, file, event.target.result);
                };
                // when the file is read it triggers the onload event above.
                reader.readAsDataURL(file);
            }
        };

        $scope.previousStep = function() {
            $state.go('home.brandDetails.campaigns');
        };

        $scope.nextStep = function() {
            CampaignModuleModel.setCampaign($scope.campaign);
            if ($scope.triggerItems.length === 0) {
                PopupMessageService.showConfirmMessage("Because this campaign doesn't have triggers. Do you want to create triggers?", true, null, function() {
                    if ($scope.campaign.type === "magazine") {
                        $scope.isCreateTrigger = true;
                        createTriggerPdf($scope.campaign, true);
                    } else if ($scope.campaign.type === "video") {
                        $scope.isCreateTrigger = true;
                        createTriggersForVideo($scope.campaign, true);
                    }
                }, function(err) {
                    PopupMessageService.showAlertMessage(err, false);
                });
            } else if ($scope.campaign.type === "video") {
                $state.go('home.brandDetails.editCampaignVideo', {
                    id: $scope.campaign.id
                });
            } else {
                CampaignModuleModel.setTriggerItems($scope.triggerItems);
                $state.go('home.brandDetails.createCampaignImageLinkProduct')
            }
        };

        $scope.deleteTrigger = function(trigger) {
            var index = $scope.triggerItems.indexOf(trigger);
            if (index > -1) {
                $scope.triggerItems.splice(index, 1);
                validateUploadImages();
            }
            //Reset products
            if ($scope.triggerItems.length === []) CampaignModuleModel.setListSelectedProducts([]);
        };

        $scope.resizeImage = function(trigger) {
            PopupMessageService.showConfirmMessage("Are you sure you want to resize this image?", true, null, function() {
                var img = new Image();
                img.onload = function() {
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');
                    var ratio = 1;
                    if (this.width > this.height) {
                        if (this.height < 480) {
                            ratio = 480 / this.height;
                        } else if (this.width < 640) {
                            ratio = 640 / this.width;
                        }
                    } else {
                        if (this.width < 480) {
                            ratio = 480 / this.width;
                        } else if (this.height < 640) {
                            ratio = 640 / this.height;
                        }
                    }
                    canvas.width = this.width * ratio;
                    canvas.height = this.height * ratio;
                    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                    var index = $scope.triggerItems.indexOf(trigger);
                    if (index >= 0) {
                        $scope.triggerItems[index].content = canvas.toDataURL();
                        $scope.triggerItems[index].contentBase64 = canvas.toDataURL();
                        $scope.triggerItems[index].isScale = true;
                        $scope.$apply();
                        PopupMessageService.showAlertMessage('Resize image successfully!', true);
                        validateUploadImages();
                    } else {
                        PopupMessageService.showAlertMessage('Resize image fail!', false);
                    }
                };
                img.src = trigger.content;
                img.crossOrigin = 'Anonymous';
            });
        };

        $scope.deletePDF = function() {
            PopupMessageService.showConfirmMessage("Are you sure you want to delete this campaign?", true, null, function() {
                var query = {
                    campaignID_list: $scope.campaign.id
                };
                CampaignService.deleteCampaign(query).then(function() {
                    $state.go('home.brandDetails.campaigns');
                }, function(err) {
                    PopupMessageService.showAlertMessage(err, false);
                });
            });
        };

        //-------------------------------------------Video---------------------------
        //Upload file config
        var FILE_SIZE_LIMIT = 500 * 1024 * 1024;

        var authorizationHeader = $http.defaults.headers.common['Authorization'];
        var uploader = $scope.uploader = new FileUploader({
            url: CampaignService.getUploadVideoUrl(),
            autoUpload: false,
            alias: 'content',
            headers: {
                Authorization: authorizationHeader,
                Accept: 'application/vnd.ulab.v0+json'
            },
            formData: []
        });

        //FILTERS
        uploader.filters.push({
            name: 'fileSizeFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                if (item.size > FILE_SIZE_LIMIT) {
                    $scope.errorSize = true;
                    PopupMessageService.showAlertMessage("Maximum file size 250mb.", false);
                    return false;
                } else {
                    $scope.errorSize = false;
                }

                if (item.type.indexOf('video') > -1 && item.type !== 'video/mp4' && item.type !== 'video/mov') {
                    $scope.inCorrectFormat = true;
                    return false;
                }

                return true;
            }
        });

        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
            $scope.uploadFileItem = fileItem;
        };

        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);

            var formData = item.formData;

            //var file = $('#media-file')[0].files[0];
            //formData.push({ "content": file });
            formData.push({
                "file_name": $scope.uploadFileItem.file.name
            });
            formData.push({
                "brandID": $stateParams.brandId
            });
            $scope.campaign.type === 'video' ? formData.push({
                "type": 'video'
            }) : formData.push({
                "type": 'magazine'
            });
            formData.push({
                "title": $scope.uploadFileItem.file.name
            });
            formData.push({
                "url": "http://www.ulab.com"
            });
            //formData.push({"url": ""});

            var currentUser = AuthService.getCurrentUser();
            formData.push({
                "email": currentUser.email
            });
            formData.push({
                "password": currentUser.password
            });
        };

        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
            $scope.percentProcess = progress;
            //if (progress >= 99) fileItem.progress = 99;
        };

        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
            console.log(response);
            if (status == 200 && response.campaign.is_trainning == "0") {
                $scope.isWaitingTrigger = true;
                CampaignModuleModel.setCampaign(response.campaign);
                $scope.campaign.type === 'video' ? createTriggersForVideo(response.campaign, false) : createTriggerPdf(response.campaign, false);
            } else {
                $stage.go("home.brandDetails.campaigns");
            }
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);

            fileItem.cancel();
            $scope.isProcessing = false;
            $scope.errorStatus = true;
            var errorMessage = "Can not create video campaign. Please try again."
            PopupMessageService.showAlertMessage(errorMessage, false);
        };


        //-----------------------------------------Private function-----------------------------------------------
        var checkTypeTrigger = function(element, file, data) {
            if (file.type.indexOf("image/") > -1 && $scope.inCorrectFormat === false) {
                $scope.campaign.type = 'image';

                var triggerItemModel = NewCampaignTriggerViewModel.getInstance();
                triggerItemModel.setImage(file.name, file.type, event.target.result);
                //triggerItemModel.products = $scope.triggerItems[$scope.triggerItems.length - 1].products;
                var length = $scope.triggerItems.length;
                if ($scope.triggerItems.length > 0) {
                    triggerItemModel.products = $scope.triggerItems[length - 1].products;
                } else {
                    triggerItemModel.products = [];
                }
                $scope.triggerItems.unshift(triggerItemModel);
                $scope.uploadInvalid = true;
                $timeout(function() {
                    validateUploadImages();
                }, 1000);
            } else if (file.type.indexOf("application/pdf") > -1) {
                $scope.campaign.type = 'magazine';
                //uploadFilePdf(file);
                $scope.isLoading = true;
                $scope.uploadFileItem.upload();
            } else if (file.type.indexOf("video/") > -1) {
                //var video = document.createElement("video");
                //video.src = data;
                // video.onloadedmetadata = function() {
                // 	if(video.videoWidth < 320 || video.videoHeight < 320 ) {
                // 		PopupMessageService.showAlertMessage("Can not create Campaign. Size of video should be minimum 320x320px.", false);
                // 	} else if($scope.uploadFileItem) {
                // 			$scope.isLoading = true;
                // 			$scope.uploadFileItem.upload();
                // 	}
                // }
                $scope.campaign.type = 'video';
                $scope.isLoading = true;
                $scope.uploadFileItem.upload();
            } else {
                $scope.inCorrectFormat = true;
            }
            // } else {
            // 	//TODO: VIDEO
            // }
            $scope.$apply();
            $("#file").val("");
        };

        var validateUploadImages = function() {
            var image = new Image();
            $scope.uploadInvalid = false;
            for (var i = 0; i < $scope.triggerItems.length; i++) {
                image.src = $scope.triggerItems[i].content;
                if ((image.width < 640 || image.height < 480) && $scope.triggerItems[i].isScale !== true) {
                    $scope.uploadInvalid = true;
                    $scope.triggerItems[i].invalidImage = true;
                } else {
                    $scope.triggerItems[i].invalidImage = false;
                }
            }
        };

        var createTriggerPdf = function(campaign, gotoNext) {
            var array = [];
            var prefix = campaign.start_frame.split(".pdf-")[0];
            var start_frame = Number(campaign.start_frame.split(".pdf-")[1].split(".png")[0]);
            var end_frame = Number(campaign.end_frame.split(".pdf-")[1].split(".png")[0]);
            var data = {
                campaignID: campaign.id,
                // url: campaign.url,
                url: "",
                content_list: [],
                filename_list: [],
                format: 'url'
            };
            for (var i = start_frame; i <= end_frame; i++) {
                data.content_list.push({
                    content_list: prefix + '.pdf-' + i + '.png'
                });
                data.filename_list.push({
                    filename_list: i + '.png'
                });
            }

            data.content_list = JSON.stringify(_.pluck(data.content_list, "content_list"));
            data.filename_list = JSON.stringify(_.pluck(data.filename_list, "filename_list"));

            CampaignService.createMultiTrigger(data).then(function(result) {
                console.log(result);
				$scope.campaign = campaign;
                for (var i = 0; i < result.triggers.length; i++) {
                    result.triggers[i].products = [];
                    $scope.triggerItems.unshift(result.triggers[i]);
                }
                CampaignModuleModel.setTriggerItems($scope.triggerItems);
                $scope.isLoading = false;
                $scope.isWaitingTrigger = false;
                $scope.isCreateTrigger = false;
                if (gotoNext) $state.go('home.brandDetails.createCampaignImageLinkProduct');
            }, function(err) {
                PopupMessageService.showAlertMessage(err, false);
            });
        };

        var createTriggersForVideo = function(campaign, gotoNext) {
            var deferred = $q.defer();

            var frameInfo = CampaignService.getFrames(campaign);
            var fromFrame = frameInfo.fromFrame,
                toFrame = frameInfo.toFrame;

            var data = {
                campaignID: campaign.id,
                //url: campaign.url,
                url: "",
                start: fromFrame,
                end: toFrame
            };

            CampaignService.createTriggerMedia(data).then(function(result) {
                for (var i = 0; i < result.length; i++) {
                    result[i].products = [];
                }
                $scope.isLoading = false;
                $scope.isCreateTrigger = false;
                $scope.isWaitingTrigger = false;

                $scope.campaign = campaign;
                $scope.triggerItems = result;
                CampaignModuleModel.setTriggerItems(result.reverse());
                $("#videoCampain source").attr("src", campaign.image_url);
                $("#videoCampain")[0].load();
                if (gotoNext) $state.go('home.brandDetails.editCampaignVideo', {
                    id: $scope.campaign.id
                });
                deferred.resolve(result);
            }, function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    });

})(angular, _);
