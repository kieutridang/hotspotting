(function (angular, _) {
	'use strict';

  angular.module('productModule').factory('ProductModuleModel', function() {

		this.product = {};
		this.feature = {};

		this.setProduct = function(product) {
			this.product = product;
		}

		this.getProduct = function() {
			return this.product;
		}

		this.setFeature = function(feature) {
			this.feature = feature;
		}

		this.getFeature = function() {
			return this.feature;
		}

    return {
			setProduct: this.setProduct,
		  getProduct: this.getProduct,
			setFeature: this.setFeature,
			getFeature: this.getFeature
    };

  });

})(angular, _);
