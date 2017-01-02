(function (angular, _) {
	'use strict';

	var models = angular.module('models');

	models.factory('NewCampaignTriggerViewModel', function (BaseViewModel) {
		function NewCampaignTriggerViewModel() {
			var $this = this;

			var init = function () {
				angular.extend($this, {
					cssClass: '',
					type: '',
					// Can be File object content or string
					content: null,
					contentBase64: '',
					fileName: '',
					url: ''
				})
			};

			init();
			//
			return $this;
		}

		BaseViewModel.toBaseClass(NewCampaignTriggerViewModel);

		/**
		 * Set type of this trigger as image.
		 * @param file HTML5 file object
		 */
		NewCampaignTriggerViewModel.prototype.setImage = function (fileName, fileMimeType, contentInBase64) {
			this.id = null;
			this.cssClass = 'image-trigger';
			this.type = 'image';
			this.fileName = fileName;
			this.content = contentInBase64;
			this.contentBase64 = contentInBase64; // backup for review
			// now we convert from base64 to File object
			/*var blob = new Blob([contentInBase64], {type: fileMimeType});
			this.content = new File([blob], Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10));*/
			return this;
		};

		NewCampaignTriggerViewModel.prototype.setKeyword = function (content, url) {
			this.id = Math.random();
			this.type = 'keyword';
			this.content = content;
			this.url = url;
			this.cssClass = 'keyword-trigger';
			return this;
		};


		return {
			/**
			 * Get new instance of NewCampaignTriggerViewModel
			 * @returns {NewCampaignTriggerViewModel}
			 */
			getInstance: function () {
				return new NewCampaignTriggerViewModel();
			}
		};
	});


})(angular, _);
