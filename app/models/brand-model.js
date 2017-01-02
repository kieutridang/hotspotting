(function (angular, _) {
	'use strict';

	var models = angular.module('models');

	models.factory('BrandModel', function () {
		function BrandModel() {
			var $this = this;

			var init = function () {
				angular.extend($this, {
					id: 0,
					name: "",
					uuid: '',
					type: '',
					url: '',
					no_campaigns: 0,
					images: null,
					created_at: new Date(),
					updated_at: new Date()
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

		BrandModel.prototype.setData = function (model) {
			_update(model, this);
			_checkNull(this);

			// TODO: need to fix this from the API
			if (this.url == '') {
				this.url = 'content/images/ic/ic_logo.png';
			}
			return this;
		};

		return {
			/**
			 * Get new instance of BrandModel
			 * @param $scope
			 * @returns {BrandModel}
			 */
			getInstance: function () {
				return new BrandModel();
			}
		};
	});

})(angular, _);


