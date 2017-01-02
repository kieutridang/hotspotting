(function (angular, _) {
	'use strict';

  angular.module('feedModule').factory('FeedModuleModel', function() {

		this.listCampaigns = {};

		this.setListCampaigns = function(listCampaigns) {
			this.listCampaigns = listCampaigns;
		}

		this.getListCampaigns = function() {
			return this.listCampaigns;
		}

    return {
			setListCampaigns: this.setListCampaigns,
		  getListCampaigns: this.getListCampaigns
    };

  });

})(angular, _);
