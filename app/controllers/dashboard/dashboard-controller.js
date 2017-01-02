(function(angular, _) {
    'use strict';

    angular.module('dashboardModule').controller('DashboardController', ['$rootScope', '$window', '$scope', '$state', '$interval', '$timeout', '$uibModal', '$filter', 'DashboardService', 'AnalyticsService', 'BrandService', 'CampaignService', 'PopupMessageService', 'appConfig', 'DashboardModel', 'localStorageService', 'OrderService',
        function($rootScope, $window, $scope, $state, $interval, $timeout, $uibModal, $filter, DashboardService, AnalyticsService, BrandService, CampaignService, PopupMessageService, appConfig, DashboardModel, localStorageService, OrderService) {
            var refreshIntervalId = null;

            //Variable
            $scope.isScans = true;
            $scope.selectOption = 168;
            $scope.isActiveCombobox = false;
            $scope.isActiveOptionCombobox = false;
            $scope.settingScans = {};
            $scope.settingSales = {};

            // Scans chart configs
            $scope.scans = DashboardModel.getBoxChartConfig();
            $scope.activeUsers = angular.copy($scope.scans);
            $scope.activeCampaigns = angular.copy($scope.scans);
            $scope.activeTriggers = angular.copy($scope.scans);

            $scope.activeUsersChart = DashboardModel.getActiveUsersConfig();

            // Sales chart configs
            $scope.totalRevenues = angular.copy($scope.scans);
            $scope.transactions = angular.copy($scope.scans);
            $scope.avgRevenuePerSale = angular.copy($scope.scans);
            $scope.saleAndScans = angular.copy($scope.scans);

            $scope.totalRevenuesChart = DashboardModel.getTotalRevenueConfig();
            $scope.conversionChart = DashboardModel.getConversionChartConfig();
            $scope.daytimesSalesChart = DashboardModel.getDaytimesSalesChartConfig();
            $scope.daytimesTransactionsChart = DashboardModel.getDaytimesTransactionsChartConfig();

            $scope.selectingCampaigns = [];
            $scope.nowDate = moment().tz("UTC").format(DATEFORMAT01);
            $scope.nowDateFrom = moment().tz("UTC").format(DATEFORMAT01);
            $scope.nowDateLive = moment().tz("UTC").format(DATEFORMAT04);
            $scope.nowHour = moment().local().hour();
            $scope.nowMinute = moment().local().minute();
            $scope.isLoading = false;

            $scope.listCampaigns = [];
            $scope.params = {};

            $scope.settingScans = DashboardModel.getScansSetting();
            $scope.settingSales = DashboardModel.getSalesSetting();

            $scope.switchTab = function(isScans) {
                $scope.isScans = isScans;

                // Set default analytic option
                if ($scope.isScans) {
                    $scope.selectOptionAnalytics('7days', null);
                } else {
                    $scope.selectOptionAnalytics('7days', null);
                }

                analyticsByOptions();
                getAnalyticsData();
            };

            $scope.settingDashboard = function () {
                DashboardModel.setSettingDashboard($scope.settingCharts);
                DashboardModel.setTimeRefreshing($scope.timeRefreshing);
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'views/dashboard/modal-setting-dashboard.html',
                    // size: 'sm',
                    windowClass: "modal-product",
                    backdrop: 'static',
                    controller: 'settingDashboardController'
                });
                modalInstance.result.then(function (result) {
                    //$scope.settingDashboard =
                }, function () {
                    $scope.settingCharts = DashboardModel.getSettingDashboard();
                    $scope.timeRefreshing = DashboardModel.getTimeRefreshing();
                    refreshTime();
                });
            };

            $scope.activeCombobox = function() {
                $scope.isActiveCombobox = !$scope.isActiveCombobox;
            };

            $scope.activeOptionCombobox = function() {
                $scope.isActiveOptionCombobox = !$scope.isActiveOptionCombobox;
            };

            $scope.selectOptionAnalytics = function(value, campaign) {
                $scope.isLoading = true;
                if (value === 'live') {
                    $scope.selectOption = 1;
                } else if (value === '7days') {
                    $scope.selectOption = 168;
                } else if (value === '30days') {
                    $scope.selectOption = 720;
                } else if (value === 'alltime') {
                    $scope.selectOption = null;
                }

                var campaignID_list = $scope.params.campaignID_list ? $scope.params.campaignID_list.split(',') : [];
                if (campaign) {
                    if (campaign === 'allCampaign') {
                        campaignID_list = null;
                    } else {
                        if (campaignID_list.join(',').indexOf(campaign.campaign_id) < 0) {
                            // Not included yet, insert selected campaign
                            campaignID_list.push(campaign.campaign_id);
                        } else {
                            // Included, remove selected campaign
                            _.remove(campaignID_list, function(campaignId) {
                                return campaignId === campaign.campaign_id;
                            });
                        }
                    }
                    $scope.params.campaignID_list = campaignID_list ? campaignID_list.join(',') : null;
                }

                analyticsByOptions();
                getAnalyticsData();
            };

            $scope.settingDashboard = function() {
                if ($scope.isScans) {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/dashboard/modal-setting-scans.html',
                        controller: 'SettingScansController',
                        windowClass: "modal-product",
                        backdrop: 'static'
                    });
                    modalInstance.result.then(function (result) {}, function () {
                        $scope.settingScans = DashboardModel.getScansSetting();
                        refreshTime($scope.settingScans.timeRefreshing);
                    });
                } else {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'views/dashboard/modal-setting-sales.html',
                        controller: 'SettingSalesController',
                        windowClass: "modal-product",
                        backdrop: 'static'
                    });
                    modalInstance.result.then(function (result) {}, function () {
                        $scope.settingSales = DashboardModel.getSalesSetting();
                        refreshTime($scope.settingSales.timeRefreshing);
                    });
                }
            };

            $scope.activeUsersChart.options.legend.labelFormatter = function() {
                return '<span class="fa fa-circle" style="margin-right: 7px; color: #00ADEE"></span><span style="font-family: gotham">' + activeUsersLegendTitle($scope.selectOption) + '</span>';
            };

            $scope.activeUsersChart.options.tooltip.formatter = function() {
                return [
                    '<div class="custom-chart-tooltip">',
                    '<h5>' + activeUsersLegendTitle($scope.selectOption) + '</h5>',
                    '<h6>' + $filter('kmNumber')(this.y) + '</h6>',
                    '<p>' + moment(this.x).format('ddd MMM DD, YYYY') + '</p>',
                    '<span class="navigator"></span>',
                    '</div>'
                ].join('');
            };

            function analyticsByOptions() {
                $scope.params.to_date = moment().tz("UTC").format(DATEFORMAT02);
                if ($scope.selectOption === 1) {
                    $scope.params.live_datetime = moment().tz("UTC").format(DATEFORMAT03);
                    $scope.params.from_date = moment().tz("UTC").format(DATEFORMAT02);
                } else if ($scope.selectOption === 168 || $scope.selectOption === 720) {
                    delete $scope.params.live_datetime;
                    $scope.params.from_date = moment($scope.params.to_date).subtract(($scope.selectOption - 24) / 24, 'day').format(DATEFORMAT02);
                    $scope.nowDateFrom = moment($scope.params.to_date).subtract(($scope.selectOption - 24) / 24, 'day').format(DATEFORMAT01);
                } else {
                    delete $scope.params.live_datetime;
                    delete $scope.params.to_date;
                    delete $scope.params.from_date;
                }

                if ($scope.isScans) {
                    DashboardService.getTotalnumberScans($scope.params).then(function(results) {
                        $scope.countdata = results;

                        $scope.scans = dataBoxScan($scope.countdata.data_scans, $scope.scans, $scope.countdata.growth_percent_scans);
                        $scope.activeUsers = dataBoxScan($scope.countdata.data_users, $scope.activeUsers, $scope.countdata.growth_percent_users);
                        $scope.activeCampaigns = dataBoxScan($scope.countdata.data_campaigns, $scope.activeCampaigns, $scope.countdata.growth_percent_campaigns);
                        $scope.activeTriggers = dataBoxScan($scope.countdata.data_triggers, $scope.activeTriggers, $scope.countdata.growth_percent_triggers);

                        $scope.activeUsersChart = dataActiveUsers($scope.countdata.data_users, $scope.activeUsersChart);
                    }, function(err) {
                        console.log(err);
                    });

                    AnalyticsService.getAnalytics($scope.params).then(function(result) {
                        setDataAnalytics(result);
                        $scope.genderScanPie = DashboardModel.getGenderConfig(result.genders);
                        $scope.ageScanPie = DashboardModel.getAgeConfig(result.ages);
                        $scope.countryScanPie = DashboardModel.getCountryConfig(result.top_countries);
                        $scope.deviceScanPie = DashboardModel.getDeviceConfig(result.top_phone_types);

                        $scope.genderScanPie = dataGenderPie($scope.genderScanPie, result.genders);
                        $scope.ageScanPie = dataAgePie($scope.ageScanPie, result.ages);
                        $scope.countryScanPie = dataCountryPie($scope.countryScanPie, result.top_countries);
                        $scope.deviceScanPie = dataDevicePie($scope.deviceScanPie, result.top_phone_types);
                    }, function(err) {
                        console.log(err);
                    });
                } else {
                    if ($scope.selectOption === 1) $scope.params.day_hour = "1";
                    DashboardService.getTotalnumberSales($scope.params).then(function(results) {
                        $scope.countdata = results;

                        console.log($scope.countdata);
                        $scope.totalRevenues = dataBoxSale($scope.countdata.data_total_revenue, $scope.totalRevenues, $scope.countdata.growth_percent_total_revenue);
                        $scope.transactions = dataBoxSale($scope.countdata.data_transactions, $scope.transactions, $scope.countdata.growth_percent_transactions);
                        $scope.avgRevenuePerSale = dataBoxSale($scope.countdata.data_avg_revenue_per_sale, $scope.avgRevenuePerSale, $scope.countdata.growth_percent_transactions);
                        $scope.saleAndScans = dataBoxSale($scope.countdata.data_sales_vs_scans, $scope.saleAndScans, $scope.countdata.growth_percent_transactions);

                        $scope.totalRevenuesChart = dataTotalRevenues($scope.totalRevenuesChart, results.data_total_revenue);
                        $scope.conversionChart = dataConversion($scope.conversionChart, results.data_sales_vs_scans);
                        $scope.daytimesSalesChart = dataDaytimesSales($scope.daytimesSalesChart, results.data_avg_revenue_per_sale);
                        $scope.daytimesTransactionsChart = dataDaytimesTransactions($scope.daytimesTransactionsChart, results.data_transactions);
                    }, function(err) {
                        console.log(err);
                    });

                    OrderService.getOrderAnaylytics($scope.params).then(function(result) {
                        setDataAnalytics(result);

                        $scope.genderSalePie = DashboardModel.getGenderConfig(result.genders);
                        $scope.ageSalePie = DashboardModel.getAgeConfig(result.ages);
                        $scope.countrySalePie = DashboardModel.getSaleCountryConfig(result.top_countries);
                        $scope.deviceSalePie = DashboardModel.getSaleDeviceConfig(result.top_phone_types);

                        $scope.genderSalePie = dataGenderPie($scope.genderSalePie, result.genders);
                        $scope.ageSalePie = dataAgePie($scope.ageSalePie, result.ages);
                        $scope.countrySalePie = dataSaleCountryPie($scope.countrySalePie, result.top_countries);
                        $scope.deviceSalePie = dataSaleDevicePie($scope.deviceSalePie, result.top_phone_types);

                    }, function(err) {
                        console.log(err);
                    });
                }
            }

            function getAnalyticsData() {
                $scope.isLoading = true;

                var params = {
                    brandID: null,
                    campaignID: null,
                    from_date: $scope.params.from_date,
                    to_date: $scope.params.to_date
                };

                AnalyticsService.getQueryList(params).then(function(list) {
                    $scope.querryList = list;
                    $scope.listCampaigns = _.uniq($scope.querryList.results, function(item, key, campaign_id) {
                        return item.campaign_id;
                    });

                    var selectingCampaignIds = ($scope.params.campaignID_list) ? $scope.params.campaignID_list.split(',') : null;
                    $scope.selectingCampaigns = [];
                    if (selectingCampaignIds) {
                        _.each(selectingCampaignIds, function(selectingCampaignId) {
                            var foundCampaign = _.find($scope.listCampaigns, function(campaign) {
                                return campaign.campaign_id === selectingCampaignId;
                            });

                            if (foundCampaign) {
                                // Mark the selecting campaign
                                $scope.selectingCampaigns.push(foundCampaign);
                                foundCampaign.isSelected = true;
                            } else {
                                // Remove it if move between day options (live/7/30/all) & campaign does not exist
                                _.remove(selectingCampaignIds, function(campaignId) {
                                    return campaignId === selectingCampaignId;
                                });
                            }
                        });
                        $scope.params.campaignID_list = selectingCampaignIds.join(',');
                    }
                }, function(err) {
                    console.log(err);
                });
            }

            function setDataAnalytics(result) {
                $scope.analytics = result;
                $scope.topCampaigns = $scope.analytics.top_campaigns;
                $scope.topWorstCampaigns = $scope.analytics.top_worst_campaigns;
                $scope.topTriggers = $scope.analytics.top_trigger_images;
                $scope.formatMedia = $scope.analytics.media;
                $scope.isLoading = false;
                $scope.topProducts = $scope.analytics.top_products;
            }

            function dataBoxScan(data, chart, growthPercent) {
                chart.series[0].data = [];
                for (var i = 0; i < data.length; i++) {
                    chart.series[0].data.push(parseFloat(data[i].no_searches));
                }
                chart.options.colors = growthPercent >= 0 ? [GREENCOLOR] : [REDCOLOR];
                return chart;
            }

            function dataBoxSale(data, chart, growthPercent) {
                chart.series[0].data = [];
                for (var i = 0; i < data.length; i++) {
                    chart.series[0].data.push(parseFloat(data[i].result));
                }

                console.log(chart.series[0]);

                chart.options.colors = growthPercent >= 0 ? [GREENCOLOR] : [REDCOLOR];
                return chart;
            }

            function dataGenderPie(chart, genders) {
                chart.series[0].data = [
                    ['Male', genders.male.percent],
                    ['Female', genders.female.percent]
                ];
                var image;
                var text;
                if(!genders || genders.length === 0) {
                    return;
                }
                if(genders.male.percent > genders.female.percent) {
                    image = './content/css/img/pieImages/male_icon.svg';
                    text = 'Male';
                } else if (genders.male.percent < genders.female.percent){
                    image = './content/css/img/pieImages/female_icon.svg';
                    text = 'Female';
                } else if (genders.male.percent === 0 && genders.female.percent === 0) {
                    image = './content/css/img/pieImages/male_icon.svg';
                    text = 'No Data';
                } else {
                    image = './content/css/img/pieImages/male_icon.svg';
                    text = 'The same';
                }
                // chart.renderer.image(image ,70, 10, 120, 120).add();
                // chart.renderer.text(text, 110, 105).add();
                chart.options.subtitle = {
                    useHTML: true,
                    text: '<div style="text-align:center;"><img src="'+ image +'" style="width:4vh;"/><br/><h5>' + text + '</h5></div>',
                    align: 'center',
                    verticalAlign: 'middle',
                    x: 0,
                    y: -35
                };

                return chart;
            }

            function dataAgePie(chart, ages) {
                chart.series[0].data = _.map(ages, function(element) {
                    return [element.age, element.percent];
                });

                if(!ages || ages.length === 0) {
                    return;
                }
                var text = _.maxBy(ages, 'percent').age;
                text = _.maxBy(ages, 'percent').percent !== 0 ? text : 'No Data';
                var image = './content/css/img/pieImages/birthday_icon.svg';

                chart.options.subtitle = {
                    useHTML: true,
                    text: '<div style="text-align:center;"><img src="'+ image +'" style="width:4vh;"/><br/><h5>' + text + '</h5></div>',
                    align: 'center',
                    verticalAlign: 'middle',
                    x: 0,
                    y: -35
                };
                return chart;
            }

            function dataCountryPie(chart, countries) {
                chart.series[0].data = _.map(countries, function(element) {
                    return [element.query_country, element.percent];
                });
                if(!countries || countries.length === 0) {
                    return;
                }
                var text = _.maxBy(countries, 'percent').query_country;
                var image = './content/css/img/pieImages/globe_icon.svg';

                chart.options.subtitle = {
                    useHTML: true,
                    text: '<div style="text-align:center;"><img src="'+ image +'" style="width:4vh;"/><br/><h5>' + text + '</h5></div>',
                    align: 'center',
                    verticalAlign: 'middle',
                    x: 0,
                    y: -35
                };

                return chart;
            }

            function dataDevicePie(chart, devices) {
                chart.series[0].data = _.map(devices, function(element) {
                    return [element.query_phone_type, element.percent];
                });

                if(!devices || devices.length === 0) {
                    return;
                }
                var text = _.maxBy(devices, 'percent').query_phone_type;
                var image;
                switch (text) {
                    case 'iOS':
                        image = './content/css/img/pieImages/apple_icon.svg';
                        break;
                    case 'Android':
                    image = './content/css/img/pieImages/android_icon.svg';
                        break;
                    default:

                }

                chart.options.subtitle = {
                    useHTML: true,
                    text: '<div style="text-align:center;"><img src="'+ image +'" style="width:4vh;"/><br/><h5>' + text + '</h5></div>',
                    align: 'center',
                    verticalAlign: 'middle',
                    x: 0,
                    y: -35
                };

                return chart;
            }

            function dataSaleCountryPie(chart, countries) {
                if (countries.length === 0) {
                    chart.series[0].data = [['No Data', 0]];
                } else {
                    chart.series[0].data = _.map(countries, function(element) {
                        return [element.sale_country, element.percent];
                    });
                }

                var text = _.maxBy(countries, 'percent').sale_country;
                var image = './content/css/img/pieImages/globe_icon.svg';

                chart.options.subtitle = {
                    useHTML: true,
                    text: '<div style="text-align:center;"><img src="'+ image +'" style="width:4vh;"/><br/><h5>' + text + '</h5></div>',
                    align: 'center',
                    verticalAlign: 'middle',
                    x: 0,
                    y: -35
                };

                return chart;
            }

            function dataSaleDevicePie(chart, devices) {
                if (devices.length === 0) {
                    chart.series[0].data = [['No Data', 0]];
                } else {
                    chart.series[0].data = _.map(devices, function(element) {
                        return [element.sale_phone_type, element.percent];
                    });
                }

                var text = _.maxBy(devices, 'percent').sale_phone_type;
                var image;
                switch (text) {
                    case 'iOS':
                        image = './content/css/img/pieImages/apple_icon.svg';
                        break;
                    case 'Android':
                    image = './content/css/img/pieImages/android_icon.svg';
                        break;
                    default:

                }

                chart.options.subtitle = {
                    useHTML: true,
                    text: '<div style="text-align:center;"><img src="'+ image +'" style="width:4vh;"/><br/><h5>' + text + '</h5></div>',
                    align: 'center',
                    verticalAlign: 'middle',
                    x: 0,
                    y: -35
                };

                return chart;
            }

            function activeUsersLegendTitle(selectOption) {
                if (selectOption === 1) {
                    return 'Daily Users';
                } else if (selectOption === 168) {
                    return 'Weekly Users';
                } else if (selectOption === 720) {
                    return 'Monthly Users';
                } else {
                    return 'All Times';
                }
            }

            function dataActiveUsers(data, chart) {
                if (data.length === 0) {
                    return chart;
                }

                chart.series[0].data = [];
                chart.options.colors = ['#00ADEE'];

                var year = new Date().getFullYear();
                var month = data[0].month - 1;
                var day = data[0].day;

                chart.series[0].pointStart = Date.UTC(year, month, day);
                for (var i = 0; i < data.length; i++) {
                    chart.series[0].data.push([Date.UTC(year, data[i].month - 1, data[i].day), parseFloat(data[i].no_searches)]);
                }
                return chart;
            }

            function dataTotalRevenues(chart, data) {
                if (data.length === 0) {
                    return chart;
                }
                var mappedData = _.map(data, function(element) {
                    if(element.day < 10) element.day = '0'.concat(element.day);
                    return {
                        result: element.result,
                        date: moment(element.day + element.month, 'DDMM'),
                        day: element.day,
                        month: element.month - 1,
                        year: new Date().getFullYear()
                    };
                });
                var sortedData = _.sortBy(mappedData, function(element) {
                    return element.date.dayOfYear();
                });

                chart.series[0].data = [];
                chart.options.colors = ['#00ADEE'];

                var year = new Date().getFullYear();
                var month = data[0].month - 1;
                var day = data[0].day;

                chart.series[0].pointStart = Date.UTC(year, month, day);
                // chart.series[0].pointStart = sortedData.date.format('MMM DD YYYY');

                // for (var i = 0; i < data.length; i++) {
                //     chart.series[0].data.push([Date.UTC(year, data[i].month - 1, data[i].day), parseFloat(data[i].result)]);
                // }
                chart.series[0].data = _.map(sortedData, function(element) {
                    return [Date.UTC(element.year, element.month, element.day), parseFloat(element.result)];
                });
                return chart;
            }

            function dataConversion(chart, data) {
                if (data.length === 0) {
                    return chart;
                }
                var mappedData = _.map(data, function(element) {
                    if(element.day < 10) element.day = '0'.concat(element.day);;
                    return {
                        result: element.result,
                        date: moment(element.day + element.month, 'DDMM'),
                        day: element.day,
                        month: element.month - 1,
                        year: new Date().getFullYear()
                    };
                });
                var sortedData = _.sortBy(mappedData, function(element) {
                    return element.date.dayOfYear();
                });

                chart.series[0].data = [];
                chart.options.colors = ['#00ADEE'];

                var year = new Date().getFullYear();
                var month = data[0].month - 1;
                var day = data[0].day;

                chart.series[0].pointStart = Date.UTC(year, month, day);

                // for (var i = 0; i < data.length; i++) {
                //     chart.series[0].data.push([Date.UTC(year, data[i].month - 1, data[i].day), parseFloat(data[i].result)]);
                // }
                chart.series[0].data = _.map(sortedData, function(element) {
                    return [Date.UTC(element.year, element.month, element.day), parseFloat(element.result)];
                });
                return chart;
            }

            function dataDaytimesSales(chart, data) {
                if (data.length === 0) {
                    return chart;
                }
                var mappedData = _.map(data, function(element) {
                    if(element.day < 10) element.day = '0'.concat(element.day);;
                    return {
                        result: element.result,
                        date: moment(element.day + element.month, 'DDMM'),
                        day: element.day,
                        month: element.month - 1,
                        year: new Date().getFullYear()
                    };
                });
                var sortedData = _.sortBy(mappedData, function(element) {
                    return element.date.dayOfYear();
                });

                chart.series[0].data = [];
                chart.options.colors = ['#00ADEE'];

                var year = new Date().getFullYear();
                var month = data[0].month - 1;
                var day = data[0].day;

                chart.series[0].pointStart = Date.UTC(year, month, day);

                // for (var i = 0; i < data.length; i++) {
                //     chart.series[0].data.push([Date.UTC(year, data[i].month - 1, data[i].day), parseFloat(data[i].result)]);
                // }
                chart.series[0].data = _.map(sortedData, function(element) {
                    return [Date.UTC(element.year, element.month, element.day), parseFloat(element.result)];
                });
                return chart;
            }

            function dataDaytimesTransactions(chart, data) {
                if (data.length === 0) {
                    return chart;
                }
                var mappedData = _.map(data, function(element) {
                    if(element.day < 10) element.day = '0'.concat(element.day);;
                    return {
                        result: element.result,
                        date: moment(element.day + element.month, 'DDMM'),
                        day: element.day,
                        month: element.month - 1,
                        year: new Date().getFullYear()
                    };
                });
                var sortedData = _.sortBy(mappedData, function(element) {
                    return element.date.dayOfYear();
                });

                chart.series[0].data = [];
                chart.options.colors = ['#00ADEE'];

                var year = new Date().getFullYear();
                var month = data[0].month - 1;
                var day = data[0].day;

                chart.series[0].pointStart = Date.UTC(year, month, day);

                // for (var i = 0; i < data.length; i++) {
                //     chart.series[0].data.push([Date.UTC(year, data[i].month - 1, data[i].day), parseFloat(data[i].result)]);
                // }
                chart.series[0].data = _.map(sortedData, function(element) {
                    return [Date.UTC(element.year, element.month, element.day), parseFloat(element.result)];
                });
                return chart;
            }

            function refreshTime(intervalTime) {
                if (refreshIntervalId) {
                    $interval.cancel(refreshIntervalId);
                }

                refreshIntervalId = $interval(function() {
                    if ($scope.selectOption === 1) {
                        $scope.selectOptionAnalytics('live', null);
                    }
                }, intervalTime * 60000);
            }

            $('.combobox-list-wrapper').on('click', function(e) {
                e.stopPropagation();
            });

            $('.page-content').on('click', function(e) {
                e.preventDefault();
                // Clear active tooltips
                if ($('#ages').highcharts() !== undefined) {
                    $('#ages').highcharts().tooltip.hide();
                }

                if ($('#genres').highcharts() !== undefined) {
                    $('#genres').highcharts().tooltip.hide();
                }

                if ($('#platform').highcharts() !== undefined) {
                    $('#platform').highcharts().tooltip.hide();
                }
            });

            $scope.$on('$destroy', function() {
                $('.page-content').off('click');
                if (refreshIntervalId) {
                    $interval.cancel(refreshIntervalId);
                }
            });

            getAnalyticsData();
            analyticsByOptions();
            refreshTime($scope.settingScans.timeRefreshing);
        }
    ]);
})(angular, _);
