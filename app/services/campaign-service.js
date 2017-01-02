(function (angular, _) {
	'use strict';

	// Brands Service
	//app.factory('CampaignService', function ($string, $ss, $validation, $q, ) {
	angular.module('campaignModule').factory('CampaignService', function ($q, Restangular, BaseService, AuthService,CampaignModel, TriggerModel, QuerryModel) {
		var campaigns = Restangular.all('campaign');
		var triggers = Restangular.all('trigger');

		function getUploadVideoUrl(options) {
			var url = this.apiUrl + '/campaign/create';
			return url;
		}

		function getCampaignList(param) {
			var deferred = $q.defer();
			var errorMessage = "Can't get campaigns. Please try again.";

			campaigns.one('list').customPOST(param).then(function (result) {
				if (result.status_code == 200) {

					var campaigns = _.map(result.campaign, function (data) {
						return CampaignModel.getInstance().setData(data);
					});

					deferred.resolve(campaigns);
				} else {
					errorMessage = result.message || errorMessage;
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				var data = res.data;
				if (data.status_code == 404) {
					deferred.resolve([]);
					return;
				}

				errorMessage = data.message || errorMessage;
				//errorMessage = service.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};

		function getCampaignListU(param) {
			var deferred = $q.defer();
			var errorMessage = "Can't get campaigns. Please try again.";

			campaigns.one('list').customPOST(param).then(function (result) {
				if (result.status_code == 200) {

					var campaigns = _.map(result.campaign, function (data) {
						return CampaignModel.getInstance().setData(data);
					});
					var result = {
						data: campaigns,
						total_campaign: result.total_campaign,
						total_trigger: result.total_trigger,
						total_product: result.total_product
					};

					deferred.resolve(result);
				} else {
					errorMessage = result.message || errorMessage;
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				var data = res.data;
				if (data.status_code == 404) {
					deferred.resolve([]);
					return;
				}

				errorMessage = data.message || errorMessage;
				//errorMessage = service.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};

		function getTriggerList(param) {
			var deferred = $q.defer();
			var errorMessage = "Can't get triggers. Please try again.";

			triggers.one('list').customPOST(param).then(function (result) {
				if (result.status_code == 200) {
					var triggers = result.trigger;
					deferred.resolve(triggers);
				} else {
					errorMessage = result.message || errorMessage;
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				var data = res.data;
				if (data.status_code == 404) {
					deferred.resolve([]);
					return;
				}

				errorMessage = data.message || errorMessage;
				//errorMessage = service.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};

		function addMediaCampaign(formData) {
			var deferred = $q.defer();
			var errorMessage = "Can't add new campaign. Please try again.";

			var currentUser = AuthService.getCurrentUser();
			formData.append("email", currentUser.email);
			formData.append("password", currentUser.password);

			campaigns.one('create')
				.withHttpConfig({ transformRequest: angular.identity })
				.customPOST(formData, "", undefined, { 'Content-Type': undefined })
			.then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result.campaign);
				} else {
					errorMessage = result.message || errorMessage;
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				debugger
				var data = res.data;
				if (data.status_code == 404) {
					deferred.resolve([]);
					return;
				}

				errorMessage = data.message || errorMessage;
				//errorMessage = service.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});

			return deferred.promise;
		}

		function createCampaign(data) {
			var deferred = $q.defer();
			var errorMessage = "Can't add trigger. Please try again.";

			campaigns.one('create').customPOST(data).then(function (result) {
				if (result.status_code == 200) {
					var campaign = CampaignModel.getInstance().setData(result.campaign);

					deferred.resolve(campaign);
				} else {
					errorMessage = result.message || errorMessage;
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				//debugger
				var data = res.data;
				errorMessage = data.message || errorMessage;
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};

		function updateFeeds(data) {
			var deferred = $q.defer();
			var errorMessage = "Can't update feeds. Please try again.";

			campaigns.one('set_feed').customPOST(data).then(function (result) {
				if (result.status_code == 200) {
					//var feeds = CampaignModel.getInstance().setData(result.campaign);
					deferred.resolve(result.feeds);
				} else {
					errorMessage = result.message || errorMessage;
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				//debugger
				var data = res.data;
				errorMessage = data.message || errorMessage;
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};

		function updateCampaign(data) {
			var deferred = $q.defer();
			var errorMessage = "Can't update trigger. Please try again.";

			campaigns.one('edit').customPOST(data).then(function (result) {
				if (result.status_code == 200) {
					var campaign = CampaignModel.getInstance().setData(result.campaign);

					deferred.resolve(campaign);
				} else {
					errorMessage = result.message || errorMessage;
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				//debugger
				var data = res.data;
				errorMessage = data.message || errorMessage;
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};

		function createTriggerMedia(model) {
			var deferred = $q.defer();
			var errorMessage = "Can't add trigger. Please try again.";

			triggers.one('create_media').customPOST(model).then(function (result) {
				if (result.status_code == 200) {
					var triggers = result.trigger;
					deferred.resolve(triggers);
				} else {
					errorMessage = result.message || errorMessage;
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				//debugger
				var data = res.data;
				errorMessage = data.message || errorMessage;
				//errorMessage = service.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};

		function createTrigger(model) {
			var deferred = $q.defer();
			var errorMessage = "Can't add trigger. Please try again.";

			triggers.one('create').customPOST(model).then(function (result) {
				if (result.status_code == 200) {
					var trigger = result.trigger;
					if (_.isArray(trigger))
						trigger = trigger[0];

					deferred.resolve(trigger);
				} else {
					errorMessage = result.message || errorMessage;
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				//debugger
				var data = res.data;
				errorMessage = data.message || errorMessage;
				//errorMessage = service.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};

		function createMultiTrigger(model) {
			var deferred = $q.defer();
			var errorMessage = "Can't add trigger. Please try again.";

			triggers.one('create_multiple').customPOST(model).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(result);
				} else {
					errorMessage = result.message || errorMessage;
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				//debugger
				var data = res.data;
				errorMessage = data.message || errorMessage;
				//errorMessage = service.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};

		function updateTrigger(model) {
			var deferred = $q.defer();
			var errorMessage = "Can't update trigger. Please try again.";

			triggers.one('edit').customPOST(model).then(function (result) {
				if (result.status_code == 200) {
					var trigger = result.trigger;
					trigger = TriggerModel.getInstance().setData(trigger);
					deferred.resolve(trigger);
				} else {
					errorMessage = result.message || errorMessage;
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				//debugger
				var data = res.data;
				errorMessage = data.message || errorMessage;
				//errorMessage = service.getErrorMessages(res, errorMessage);
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};

		function deleteTrigger(query) {
			var deferred = $q.defer();
			var errorMessage = "Can't delete trigger. Please try again.";

			triggers.one('delete').customPOST(query).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(true);
				} else {
					errorMessage = result.message || errorMessage;
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				var data = res.data;
				errorMessage = data.message || errorMessage;
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};

		function deleteCampaign(query) {
			var deferred = $q.defer();
			var errorMessage = "Can't delete campaign. Please try again.";

			campaigns.one('delete').customPOST(query).then(function (result) {
				if (result.status_code == 200) {
					deferred.resolve(true);
				} else {
					errorMessage = result.message || errorMessage;
					deferred.reject(errorMessage);
				}
			}).catch(function (res) {
				var data = res.data;
				errorMessage = data.message || errorMessage;
				deferred.reject(errorMessage);
			});
			return deferred.promise;
		};

		function getFrames(campaign) {
			var fromFrame,
				toFrame;

			if (campaign.start_frame) {
				var data = campaign;
				var strText = data.start_frame;
				var arrStart = data.start_frame.split("-");
				var strCat = strText.substring(0, data.start_frame.length - arrStart[arrStart.length - 1].length - 1);
				var objLastStart = arrStart[arrStart.length - 1];
				var arrObjLastStart = objLastStart.split(".");
				fromFrame = parseInt(arrObjLastStart[0]);

				var arrEnd = data.end_frame.split("-");
				var objLastEnd = arrEnd[arrEnd.length - 1];
				var arrObjLastEnd = objLastEnd.split(".");

				toFrame = parseInt(arrObjLastEnd[0]);
			}

			return {
				fromFrame: fromFrame,
				toFrame: toFrame
			};
		}



		var getQuerryList = function (query) {
			var user = $user.User();
			var submitModel = angular.extend({}, query, user);
			var defered = $q.defer();

			$ss.post(API_QUERRY_LIST, submitModel, function (res) {
				defered.resolve(res.data.results);
			}, function (err) {
				defered.reject(err);
			});

			return defered.promise;
		};

		var getAnalyticData = function (query) {
			var defered = $q.defer();

			$ss.post(API_QUERRY_ANALYTIC, query, function (res) {
				defered.resolve(res.data.results);
			}, function (er) {
				console.log(er);
				defered.reject(er)
			});

			return defered.promise;

		};

		var getEngagementList = function (query) {
			var user = $user.User();
			var submitModel = angular.extend({}, query, user);
			var defered = $q.defer();

			$ss.post(API_ENGAGEMENT_LIST, submitModel, function (res) {
				defered.resolve(res);
			}, function (err) {
				defered.reject(err);
			});

			return defered.promise;
		};

		var getAppList = function (query) {
			var user = $user.User();
			var submitModel = angular.extend({}, query, user);
			var defered = $q.defer();

			$ss.post(API_APP_LIST, submitModel, function (res) {
				defered.resolve(res);
			}, function (err) {
				defered.reject(err);
			});

			return defered.promise;
		};

		function CampaignService() {
			BaseService.call(this);
		}

		CampaignService.prototype = _.create(BaseService.prototype, {
			'constructor': BaseService,

			getList: getCampaignList,
			getCampaignListU: getCampaignListU,
			getTriggers: getTriggerList,
			addMediaCampaign: addMediaCampaign,
			createTriggerMedia: createTriggerMedia,
			createMultiTrigger: createMultiTrigger,
			updateTrigger: updateTrigger,
			deleteTrigger: deleteTrigger,
			deleteCampaign: deleteCampaign,
			getUploadVideoUrl: getUploadVideoUrl,
			createTrigger: createTrigger,
			getFrames : getFrames,
			updateFeeds: updateFeeds,
			create: createCampaign,
			updateCampaign: updateCampaign,

			//getCampaigns: getCampaigns,
			getQuerryList: getQuerryList,
			getAnalytic: getAnalyticData,
			getEngagementList: getEngagementList,
			getAppList: getAppList,
		});

		var service = new CampaignService;
		return service;
	});


})(angular, _);
