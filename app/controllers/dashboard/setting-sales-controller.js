(function (angular, _) {
    'use strict';

    var controllers = angular.module('controllers');

    controllers.controller('SettingSalesController', ['$scope', 'DashboardModel', 'localStorageService', '$uibModalInstance',
        function ($scope, DashboardModel, localStorageService, $uibModalInstance) {

            $scope.settings = angular.copy(DashboardModel.getSalesSetting());

            $scope.close = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.changeSetting = function (value) {
                $scope.settings[value] = !$scope.settings[value];
            };

            $scope.save = function () {
                for (var item in $scope.settings) {
                    localStorageService.set(PREFIXSALE + item, $scope.settings[item]);
                }

                DashboardModel.setSalesSetting($scope.settings);
                $scope.close();
            };
        }]);
})(angular, _);
