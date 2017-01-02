(function (angular, _) {
    'use strict';

    var services = angular.module('services');

    services.factory('DashboardService', ['$log', '$http', '$q', 'Restangular', 'BaseService', '$timeout', 'DashboardModel', function ($log, $http, $q, Restangular, BaseService, $timeout, DashboardModel) {
        var dashboards = Restangular.all('query/count_by_date');
        var dashboardsScans = Restangular.all('query/scans');
        var dashboardsSales = Restangular.all('query/sales');

        function getTotalnumberScans(params) {
            var deferred = $q.defer();
            var errorMessage = "";
            dashboardsScans.post(params).then(function (response) {
                if (response.status_code == 200) {
                    deferred.resolve(response.results);
                }
                else {
                    deferred.reject(errorMessage);
                }
            }).catch(function (res) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        }

        function getTotalnumberSales(params) {
            var deferred = $q.defer();
            var errorMessage = "";
            dashboardsSales.post(params).then(function (response) {
                if (response.status_code == 200) {
                    deferred.resolve(response.results);
                }
                else {
                    deferred.reject(errorMessage);
                }
            }).catch(function (res) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        }

        function getDashboard(options) {
            var deferred = $q.defer();
            var errorMessage = "";

            dashboards.post(options).then(function (result) {
                if (result.status_code == 200) {
                    deferred.resolve(result.results);
                }
                else {
                    deferred.reject(errorMessage);
                }
            }).catch(function (res) {
                deferred.reject(errorMessage);
            });
            return deferred.promise;
        }

        function DashboardService() {
            BaseService.call(this);
        }


        //Function for chart
        //CHART AGES
        function setChartAgesFunc(chart) {
            $timeout(function () {
                var $legend = $('#customLegend');
                $legend.empty();
                if (chart.series && chart.series[0]) {
                    $.each(chart.series[0].data, function (j, data) {
                        $legend.append('<div class="widget-chart-ages"><a href="#" class="btn-chart-ages"><div class="bg-age bg-deep-blue-chart clearfix"><i class="ico-age ' + data.icon + '"></i><span class="dot-age chart-deep-blue pull-left" style="background-color:' + data.color + ';position:absolute;top:5px;left:5px;z-index:4;"></span><p class="margin-0 clearfix"><span class="kind-age pull-left medium-font font-13">' + data.age + '</span><span class="percent-kind-age pull-right medium-font font-13 txt-grey">' + data.y + '%</span></p></div></a></div>');
                    });

                    $('#customLegend .widget-chart-ages').click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $("#customLegend .widget-chart-ages").each(function (index) {
                            $(this).children('a').removeClass('active');
                            $(this).children('a').children('.bg-deep-blue-chart').css('background-color', '#f7f9fd');
                        });
                        var inx = $(this).index(),
                            point = chart.series[0].data[inx];
                        $(this).children('a').addClass('active');
                        $(this).children('a').children('.bg-deep-blue-chart').css('background-color', point.color);
                        point.select();
                        chart.tooltip.refresh(point);
                    });
                    DashboardModel.setAgesChart(chart);
                }
            }, 10);
        }

        //CHART GENRES
        function setChartGenresFunc(chart) {
            $timeout(function () {
                var $legend = $('#genresCustomLegend');
                $legend.empty();
                $.each(chart.series, function (j, item) {
                    var name = j === 0 ? 'male' : 'female';
                    $legend.append('<div class="box-genre-platform"><a href="#" class="btn-genre-platform"><div class="foreground-genre bg-deep-blue-platform"><i class="ico-sex-app ico-sex-app-' + name + '"></i><p class="margin-0 clearfix"><span class="medium-font font-13 uppercase">' + name + '</span><span class="medium-font font-13 uppercase txt-grey pull-right">' + Math.round(item.data[0].percentage * 100) / 100 + '%</span></p><span class="dot-age chart-deep-blue" style="background-color: ' + item.data[0].color + '"></span></div></a></div>');
                });

                $('#genresCustomLegend .box-genre-platform').click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $("#genresCustomLegend .box-genre-platform").each(function (index) {
                        $(this).children('a').removeClass('active');
                        $(this).children('a').children('.bg-deep-blue-platform').css('background-color', '#f7f9fd');
                    });
                    var inx = $(this).index(),
                        point = chart.series[inx];
                    $(this).children('a').addClass('active');
                    $(this).children('a').children('.bg-deep-blue-platform').css('background-color', point.data[0].color);
                    //point.select();
                    chart.tooltip.refresh(point.data[0]);
                });
                DashboardModel.setGenresChart(chart);
            }, 10);
        }

        //CHART PLATFORM
        function setChartPlatformFunc(chart) {
            $timeout(function () {
                var $legend = $('#platfromCustomLegend');
                $legend.empty();
                var platfrom = '', name = '';
                $.each(chart.series, function (j, item) {
                    if (j === 0) {
                        platfrom = 'ios';
                        name = 'ios';
                    } else {
                        platfrom = 'androil';
                        name = 'android';
                    }
                    $legend.append('<div class="box-genre-platform"><a href="#" class="btn-genre-platform"><div class="foreground-genre bg-deep-blue-platform"><i class="ico-sex-app ico-sex-app-' + platfrom + '"></i><p class="margin-0 clearfix"><span class="medium-font font-13 uppercase">' + name + '</span><span class="medium-font font-13 uppercase txt-grey pull-right">' + Math.round(item.data[0].percentage * 100) / 100 + '%</span></p><span class="dot-age chart-deep-blue" style="background-color: ' + item.data[0].color + '"></span></div></a></div>');
                });

                $('#platfromCustomLegend .box-genre-platform').click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $("#platfromCustomLegend .box-genre-platform").each(function (index) {
                        $(this).children('a').removeClass('active');
                        $(this).children('a').children('.bg-deep-blue-platform').css('background-color', '#f7f9fd');
                    });
                    var inx = $(this).index(),
                        point = chart.series[inx];
                    $(this).children('a').addClass('active');
                    $(this).children('a').children('.bg-deep-blue-platform').css('background-color', point.data[0].color);
                    //point.select();
                    chart.tooltip.refresh(point.data[0]);
                });

                DashboardModel.setPlatformChart(chart);
            }, 10);
        }

        function setCommunityTypeFunc(chart) {
            $timeout(function () {
                var $legend = $('#communityTypeCustomLegend');

                $legend.append('<div class="widget-info-chart-house clearfix"><i class="ico-house ico-house-urban pull-left"></i><span class="medium-font font-13 uppercase pull-left">urban</span><span class="medium-font font-13 txt-grey pull-right">57%</span><span class="dot-age chart-deep-blue"></span></div>');
                $legend.append('<div class="widget-info-chart-house clearfix"><i class="ico-house ico-house-suburban pull-left"></i><span class="medium-font font-13 uppercase pull-left">suburban</span><span class="medium-font font-13 txt-grey pull-right">31%</span><span class="dot-age chart-light-blue"></span></div>');
                $legend.append('<div class="widget-info-chart-house clearfix"><i class="ico-house ico-house-rural pull-left"></i><span class="medium-font font-13 uppercase pull-left">rural</span><span class="medium-font font-13 txt-grey pull-right">22%</span><span class="dot-age chart-green"></span></div>');
                $('#communityTypeCustomLegend .widget-info-chart-house').click(function (e) {
                    e.preventDefault();
                    $("#communityTypeCustomLegend .widget-info-chart-house").each(function (index) {
                        $(this).removeClass('active');
                        $(this).css('background-color', '#f7f9fd');
                    });
                    var inx = $(this).index(),
                        point = chart.series[inx];
                    $(this).addClass('active');
                    $(this).css('background-color', point.data[0].color);
                    //point.select();
                    chart.tooltip.refresh(point.data[0]);
                });
            }, 10);
        }

        function setEducationFunc(chart) {
            $timeout(function () {
                var $legend = $('#education');
                var labels = ['primary school', 'high school', 'college', 'university'];
                var levels = ['bg-primary-school', 'bg-highschool', 'bg-college', 'bg-university'];
                var icons = ['<i class="ico-education ico-education-primary"></i>', '<i class="ico-education ico-education-highschool"></i>', '<i class="ico-education ico-education-college"></i>', '<i class="ico-education ico-education-university"></i>'];
                $.each(chart.series[0].data, function (j, data) {
                    var value = parseInt(data.percentage);
                    //$legend.append('<div class="widget-chart-school"><a href="#" class="btn-chart-school><div class="foreground-chart-school ' + levels[j] + '">' + icons[j] + '<p class="margin-0 medium-font font-13 uppercase">' + labels[j] + '</p><p class="margin-0 txt-grey medium-font font-13 uppercase">15%</p><span class="dot-age chart-deep-blue"></span></div></a></div>');
                    $legend.append('<div class="widget-chart-school"><a href="#" class="btn-chart-school"><div class="foreground-chart-school ' + levels[j] + '">' + icons[j] + '<p class="margin-0 medium-font font-13 uppercase">' + labels[j] + '</p><p class="margin-0 txt-grey medium-font font-13 uppercase">15%</p><span class="dot-age chart-deep-blue"></span></div></a></div>');
                });

                $('#education .widget-chart-school').click(function (e) {
                    e.preventDefault();
                    $("#education .widget-chart-school").each(function (index) {
                        $(this).children('a').removeClass('active');
                        $(this).children('a').children('.foreground-chart-school').css('background-color', '#f7f9fd');
                    });
                    var inx = $(this).index(),
                        point = chart.series[0].data[inx];
                    $(this).children('a').addClass('active');
                    $(this).children('a').children('.foreground-chart-school').css('background-color', point.color);
                    //point.select();
                    chart.tooltip.refresh(point);
                });
            }, 10);
        };

        function setHouseholdIncomeFunc(chart) {
            $timeout(function () {
                var $legend = $('#householdLegendCustom');
                var labels = ['0-20k', '20-40k', '40-60k', '60-80k'];
                var logos = ['<i class="ico-house ico-house-usd pull-left"></i>', '<i class="ico-house ico-house-coin pull-left"></i>', '<i class="ico-house ico-house-urban pull-left"></i>', '<i class="ico-house ico-house-bag-money pull-left"></i>'];
                $.each(chart.series[0].data, function (j, data) {
                    var value = parseInt(data.percentage);
                    $legend.append('<div class="widget-info-chart-house clearfix">' + logos[j] + '<span class="medium-font font-13 pull-left">' + labels[j] + '</span><span class="medium-font font-13 txt-grey pull-right">' + value + '%</span><span class="dot-age chart-light-blue"></span></div>');
                });
                $('#householdLegendCustom .widget-info-chart-house').click(function (e) {
                    e.preventDefault();
                    $("#householdLegendCustom .widget-info-chart-house").each(function (index) {
                        $(this).removeClass('active');
                        $(this).css('background-color', '#f7f9fd');
                    });
                    var inx = $(this).index(),
                        point = chart.series[0].data[inx];
                    $(this).addClass('active');
                    $(this).css('background-color', point.color);
                    //point.select();
                    chart.tooltip.refresh(point);
                });
            }, 10);
        };

        function setPaymentMethodsFunc(chart) {
            $timeout(function () {
                var $legend = $('#paymentMethodsLegendCustom');
                var labels = ['bank transfer', 'paypal', 'credit', 'apple pay'];
                $.each(chart.series[0].data, function (j, data) {
                    $legend.append('<div class="widget-info-payment clearfix"><span class="dot-age chart-deep-blue pull-left" style="background-color:' + data.color + '"></span><span class="medium-font font-13 pull-left uppercase">' + labels[j] + '</span><span class="txt-grey font-13 pull-right">' + data.percentage + '%</span></div>')
                });
            }, 10);
        };

        DashboardService.prototype = _.create(BaseService.prototype, {
            'constructor': BaseService,
            getDashboard: getDashboard,
            getTotalnumberScans: getTotalnumberScans,
            getTotalnumberSales: getTotalnumberSales,
            setChartAgesFunc: setChartAgesFunc,
            setChartGenresFunc: setChartGenresFunc,
            setChartPlatformFunc: setChartPlatformFunc,
            setCommunityTypeFunc: setCommunityTypeFunc,
            setEducationFunc: setEducationFunc,
            setHouseholdIncomeFunc: setHouseholdIncomeFunc,
            setPaymentMethodsFunc: setPaymentMethodsFunc,
        });

        var service = new DashboardService;
        return service;
    }]);
})(angular, _);
