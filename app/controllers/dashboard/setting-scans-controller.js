(function (angular, _) {
    'use strict';

    var controllers = angular.module('controllers');

    controllers.controller('SettingScansController', ['$scope', 'DashboardModel', 'localStorageService', '$uibModalInstance',
        function ($scope, DashboardModel, localStorageService, $uibModalInstance) {

            $scope.settings = angular.copy(DashboardModel.getScansSetting());

            $scope.close = function () {
                $uibModalInstance.dismiss('cancel');
            };

            $scope.changeSetting = function (value) {
                $scope.settings[value] = !$scope.settings[value];
            };

            $scope.save = function () {
                for (var item in $scope.settings) {
                    localStorageService.set(PREFIXSCAN + item, $scope.settings[item]);
                }

                DashboardModel.setScansSetting($scope.settings);
                $scope.close();
            };
        }]);
})(angular, _);
