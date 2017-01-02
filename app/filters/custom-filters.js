(function (angular, _) {
    'use strict';

    var filters = angular.module('filters');

    filters.filter('fileType', function () {
        return function (ext) {
            ext = _.trim(ext);
            return !ext ? 'File' : ext.toUpperCase() + ' File';
        };
    });

    filters.filter('momentjs', function () {
        return function (date, format) {
            var momentDate = moment(date);
            return momentDate.format(format);
        };
    });

    filters.filter('selectOption', function () {
        return function (rawOption) {
            if (rawOption === 1) {
                return 'Live';
            } else if (rawOption === 168) {
                return 'Last 7 days';
            } else if (rawOption === 720) {
                return 'Last 30 days';
            } else {
                return 'All Time';
            }
        };
    });

    filters.filter('kmNumber', function () {
        return function (value, fixed, prefix) {
            fixed = fixed || 0;
            prefix = prefix || '';
            if (!value) {
                return prefix + '0';
            }
            return prefix + (value < 1000 ? value : (value < 1000000 ? (value/1000).toFixed(fixed) + 'k' : (value/1000000).toFixed(fixed) + 'M'));
        };
    });

    filters.filter('roundPercent', function () {
        return function (value) {
            if (!value) {
                return '0';
            }
            return value.toFixed(0);
        };
    });

})(angular, _);
