(function (angular, _) {
	'use strict';

	var models = angular.module('models');

	models.factory('TriggerModel', function () {
		function TriggerModel() {
			var $this = this;

			var init = function () {
				angular.extend($this, {
					id: 0,
					uuid: '',
					url: '',
					type: '',
					content: '',
					campaignID: '',
					status: '',
					image: '',
					image_small: '',
					image_medium: '',
					image_large: '',
					created_at: new Date(),
					updated_at: new Date(),
					image_url: ''
				})
			};

			init();
			return $this;
		}

		function _update(srcObj, destObj) {
			for (var key in destObj) {
				if (destObj.hasOwnProperty(key) && srcObj.hasOwnProperty(key)) {
					destObj[key] = srcObj[key];
				}
			}
		}

		function _checkNull(obj) {
			for (var key in obj) {
				if (obj.hasOwnProperty(key) && obj[key] == null) {
					obj[key] = '';
				}
			}
		}

		TriggerModel.prototype.setData = function (model) {
			_update(model, this);
			_checkNull(this);

			// TODO: need to fix this from the API
			//if (this.url == '') {
			//	this.url = 'https://cloud-static.iqnect.org/ogEE0IaJ1xu3qfTD9u2w7x1SG7Ljw1aU5ZJbvUax2_AwWuWKemTU6pBRgGI0cB8JLyTdV6PMo8nb0NRlTO1DBkbusjqEB8fL1mM9pQhS7xEP50N9M1h9MKsCYw7EyypjBlrAUGnCOBg=';
			//}
			return this;
		};

		return {
			/**
			 * Get new instance of CampaignModel
			 * @param $scope
			 * @returns {CampaignModel}
			 */
			getInstance: function () {
				return new TriggerModel();
			}
		};
	});


})(angular, _);


