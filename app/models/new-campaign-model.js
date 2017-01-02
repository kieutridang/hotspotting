(function (angular, _) {
	'use strict';

  angular.module('campaignModule').factory('CampaignModuleModel', function() {

		this.initCampaignModuleModel = function() {
			this.campaign = {};
			this.listFrames = [];
			this.dataTimeLine = [];
			this.triggerItems = [];
			this.triggerItemIDsEdit = [];
			this.listSelectedProducts = [];
		}

		this.setDataTimeLine = function(dataTimeLine) {
			this.dataTimeLine = dataTimeLine;
		};

		this.getDataTimeLine = function() {
			return this.dataTimeLine;
		};

		this.setCampaign = function(campaign) {
			this.campaign = campaign;
		};

		this.getCampaign = function() {
			return this.campaign;
		};

		this.setMagazine = function(magazine) {
			this.magazine = magazine;
		}

		this.getMagazine = function() {
			return this.magazine;
		}

		this.setTriggerItems = function(triggerItems) {
			this.triggerItems = triggerItems;
		};

		this.getTriggerItems = function() {
			return this.triggerItems;
		};

		this.setListSelectedProducts = function(listSelectedProducts) {
			this.listSelectedProducts = listSelectedProducts;
		};

		this.getListSelectedProducts = function() {
			return this.listSelectedProducts;
		};

		this.setTriggerItemIDsEdit = function(triggerItemIDsEdit) {
			this.triggerItemIDsEdit = triggerItemIDsEdit;
		};

		this.getTriggerItemIDsEdit = function() {
			return this.triggerItemIDsEdit;
		};

		this.setListFrames = function(listFrames) {
			this.listFrames = listFrames;
		};

		this.getListFrames = function() {
			return this.listFrames;
		};

		this.setRecipe = function(recipe) {
			this.recipe = recipe;
		};

		this.getRecipe = function() {
			return this.recipe;
		};

    return {
			setRecipe: this.setRecipe,
			getRecipe: this.getRecipe,
			setCampaign: this.setCampaign,
			getCampaign: this.getCampaign,
			setListFrames: this.setListFrames,
			getListFrames: this.getListFrames,
			setDataTimeLine: this.setDataTimeLine,
			getDataTimeLine: this.getDataTimeLine,
			setTriggerItems: this.setTriggerItems,
			getTriggerItems: this.getTriggerItems,
			setTriggerItemIDsEdit: this.setTriggerItemIDsEdit,
			getTriggerItemIDsEdit: this.getTriggerItemIDsEdit,
			setListSelectedProducts: this.setListSelectedProducts,
			getListSelectedProducts: this.getListSelectedProducts,
			initCampaignModuleModel: this.initCampaignModuleModel
    };

  });

})(angular, _);
