(function (angular, _) {
	'use strict';

	angular.module('campaignModule').controller('recipeController',
		function ($scope, $state, $stateParams, CampaignService, CampaignModuleModel, PopupMessageService, ProductService) {

		$(".recipeTable").niceScroll();

		$scope.template = {template: 1};
		$scope.recipe = [];
		$scope.campaign = CampaignModuleModel.getCampaign();
		if(!$scope.campaign ||  !$scope.campaign.id) $state.go('home.brandDetails.createCampaignSetTrigger');
		if($scope.campaign.custom) {
			var recipe = JSON.parse($scope.campaign.custom);
			if(recipe && recipe.length > 0) {
				$scope.template = recipe[0];
				$scope.recipe = recipe[1]["recipe"] || [];
			}
		}

		$scope.addRecipeText = function() {
			if($scope.recipeText) {
				$scope.recipe.push({id:$scope.recipe.length, text: $scope.recipeText});
				$scope.recipeText = "";
			}
		};

		$scope.changeTemplate = function(index) {
			$scope.template.template = index;
		};

		$scope.removeRecipeText = function(index) {
			$scope.recipe.splice(index,1);
		};

		$scope.nextStep = function() {
			$scope.campaign.custom = angular.toJson([$scope.template, {"recipe": $scope.recipe}]);
			CampaignModuleModel.setCampaign($scope.campaign)
			$state.go('home.brandDetails.createCampaignDetails');
		};

		$scope.previousStep = function() {
			$scope.campaign.custom = angular.toJson([$scope.template, {"recipe": $scope.recipe}]);
			CampaignModuleModel.setCampaign($scope.campaign)
			$state.go('home.brandDetails.editCampaignVideo', { id: $scope.campaign.id });
		}
});


})(angular, _);
