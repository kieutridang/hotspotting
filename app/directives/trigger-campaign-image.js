(function (angular, _) {
	'use strict';

	var directives = angular.module('directives');

	directives.directive("triggerCampaignImage", function ($timeout) {
		return {
			restrict: "C",
			scope: {
				trigger: "="
			},
			link: function (scope, element) {
				var imageFile;
				element.on("change", function (event) {
					var image = new Image();
					var reader = new FileReader();
					var imageFile = event.target.files[0];
					reader.onload = function (e) {
						scope.$apply(function () {
							scope.trigger['image_url'] = e.target.result;
							scope.trigger.file_name = imageFile.name;
							image.src = e.target.result;
							scope.trigger.validationImage = false;
							scope.trigger.invalidImage = false;
							if(image.width === 0 && image.height === 0) {
								scope.trigger.invalidImage = true;
							}
							//check image size
							image.onload = function() {
								if(image.width !== 0 || image.height !== 0) {
									scope.trigger.invalidImage = false;
								}
								if	(image.width < 640 || image.height < 480) {
									scope.trigger.validationImage = true;
								}
								scope.$apply();
							}
							$("#filenames").text(imageFile.name);
							$("#uploadHelper").val("");

						})
					};
					reader.readAsDataURL(imageFile);
					event.target.value = "";
				});
			}
		}
	})

})(angular, _);
