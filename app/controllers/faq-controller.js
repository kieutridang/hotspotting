(function (angular, _) {
	'use strict';

	var controllers = angular.module('controllers');

	controllers.controller('FAQController', function ($scope, $interval, $sce, $state, $stateParams, $rootScope) {

		$scope.faqs = [];
		$scope.faq = {};
		$scope.createFAQ = function(){
			$scope.faqs.push($scope.faq);
			$scope.faq = {};
		}

	    $scope.speed = 2;
	    $scope.getPointClass = getPointClass;
	    $scope.getPointRadius = getPointRadius;
	    $scope.pointClicked = pointClicked;
	    $scope.selected = {a : 'gasd'};
	    activate();

	    // function activate() {
	    //   var randomPoints = _.map(_.range(30), function() {
	    //     return {
	    //       myId       : 'ultraId-' + _.uniqueId(),
	    //       myPosition : {
	    //         lat : _.random(-180, 180, true),
	    //         lng : _.random(-180, 180, true)
	    //       },
	    //       myCategory : ['nicePlaces', 'uglyPlaces', 'aliens'][_.random(2)]
	    //     };
	    //   });
	    //   $scope.points = [
	    //     {
	    //       values : randomPoints
	    //     }
	    //   ];
	    // }

	   


	    function activate() {
	     
	      var randomPoints = _.map(_.range(30), function() {
	        return {
	          myId       : 'ultraId-' + _.uniqueId(),
	          myPosition : {
	            lat : _.random(-180, 180, true),
	            lng : _.random(-180, 180, true)
	          },
	          myCategory : ['nicePlaces', 'uglyPlaces', 'aliens'][_.random(2)]
	        };
	      });

	      // $interval(function() {
	      //   if (!$scope.points) {
	      //     return;
	      //   }
	      //   _.each($scope.points[0].values, function(city) {
	      //     city.cityColor = getRandomColor();
	      //   });
	      // }, 500);
		  $scope.points = [
	        {
	          values : randomPoints
	        }
	      ];
	     
	    }

	    function getRandomColor() {
	      return 'rgb(' + _.random(255) + ', ' + _.random(255) + ', ' + _.random(255) + ')';
	    }

	    function pointClicked(city) {
	      $scope.selected = city;
	    }

	    function getPointRadius(d) {
	      return d.myCategory.length;
	    }

	    function getPointClass(d) {
	      return d.myCategory;
	    }

	});




})(angular, _);


