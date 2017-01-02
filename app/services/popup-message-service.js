(function (angular, _) {
	'use strict';

	var services = angular.module('services');

	services.factory('PopupMessageService', function ($uibModal, $q) {

		function showAlertMessage(message, status, timeOut, callBack) {
			var defered = $q.defer();

			/*
			$scope.ok = function () {
				$uibModalInstance.close($scope.selected.item);
			};

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
			*/
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/common/modal-alert-message.html',
				size: 'sm',
				backdrop: 'static',
				controller: ['$scope', '$uibModalInstance', '$timeout', function ($scope, $uibModalInstance, $timeout) {
					$scope.message = message;
					$scope.status = status;
					$scope.closeModal = function () {
						$uibModalInstance.dismiss('cancel');
						callBack && callBack();
					}


					if (timeOut) {
						$timeout(function () {
							$uibModalInstance.dismiss('cancel');
							callBack && callBack();
						}, timeOut);
					}

				}]
			});

			defered.resolve(true);
			return defered.promise;
		}

		function showConfirmMessage(message, status, timeOut, callBack) {
			var defered = $q.defer();

			/*
			$scope.ok = function () {
				$uibModalInstance.close($scope.selected.item);
			};

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
			*/
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/common/modal-confirm-message.html',
				size: 'sm',
				backdrop: 'static',
				controller: ['$scope', '$uibModalInstance', '$timeout', function ($scope, $uibModalInstance, $timeout) {
					$scope.message = message;
					$scope.status = status;
					$scope.closeModal = function () {
						$uibModalInstance.dismiss('cancel');
					}

					$scope.ok = function () {
						$uibModalInstance.close(true);
						callBack && callBack();
					}


					if (timeOut) {
						$timeout(function () {
							$uibModalInstance.dismiss('cancel');
							callBack && callBack();
						}, timeOut);
					}

				}]
			});

			defered.resolve(true);
			return defered.promise;
		}

		function showConfirmMessageWithCancel(message, status, timeOut, callBackYes, callBackNo) {
			var defered = $q.defer();

			/*
			$scope.ok = function () {
				$uibModalInstance.close($scope.selected.item);
			};

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
			};
			*/
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'views/common/modal-confirm-message.html',
				size: 'sm',
				backdrop: 'static',
				controller: ['$scope', '$uibModalInstance', '$timeout', function ($scope, $uibModalInstance, $timeout) {
					$scope.message = message;
					$scope.status = status;
					$scope.closeModal = function () {
						$uibModalInstance.dismiss('cancel');
						callBackNo && callBackNo();
					}

					$scope.ok = function () {
						$uibModalInstance.close(true);
						callBackYes && callBackYes();
					}
					
					if (timeOut) {
						$timeout(function () {
							$uibModalInstance.dismiss('cancel');
							callBack && callBack();
						}, timeOut);
					}

				}]
			});

			defered.resolve(true);
			return defered.promise;
		}

		return {
			showAlertMessage: showAlertMessage,
			showConfirmMessage: showConfirmMessage,
			showConfirmMessageWithCancel: showConfirmMessageWithCancel
		};
	});


})(angular, _);
