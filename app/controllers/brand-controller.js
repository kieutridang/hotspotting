(function (angular, _) {
	'use strict';

	var controllers = angular.module('controllers');

	controllers.controller('BrandController', function ($scope, $filter, $state, $stateParams, BrandService, PopupMessageService) {

		$scope.brandsList = [];

		var param = {};
		BrandService.getList(param).then(function (result) {
			$scope.brandsList = result;
			var items = _.filter($scope.brandsList, { type: "cloud" })
			$scope.showBrandDetails(items[0])
		}, function (err) {
			PopupMessageService.showAlertMessage(err, false);
		});

		$scope.showBrandDetails = function (brand) {
			$state.go('home.brandDetails.campaigns', { brandId: brand.id, type: 1, brandName: brand.name });
		};
	});




})(angular, _);


