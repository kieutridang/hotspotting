(function (angular, _) {
    'use strict';

    angular.module('dashboardModule').factory('DashboardModel', ['$timeout', '$filter', function ($timeout, $filter) {

        this.getNowDate = function (format) {
            return moment().local().format(format);
        };

        this.getDefaultNumberScansSetting = function () {
            return {
                isScans: true,
                scansThisHour: true,
                activeUsers: true,
                activeCampaigns: true,
                activeTriggers: true,
                totalRevenues: false,
                transaction: false,
                avgRevenuePerSale: false,
                salesvsScans: false
            };
        };

        this.getDefaultNumberSalesSetting = function () {
            return {
                isScans: false,
                scansThisHour: false,
                activeUsers: false,
                activeCampaigns: false,
                activeTriggers: false,
                totalRevenues: true,
                transaction: true,
                avgRevenuePerSale: true,
                salesvsScans: true
            };
        };

        this.getDefaultScansSettingLive = function () {
            return {
                isScans: true,
                //globe: true,
                //map: false,
                live: true,
                recentScans: true,
                realtimeScans: true,
                totalRevenues: false,
                scansTrends: false,
                weekDayScans: false,
                daytimesSales: false,
                daytimesTransaction: false,
                conversion: false,
                industryRanking: false,
                topProducts: false,
                topPartners: false,
                paymentMethods: false,
                topCountries: false,
                demographic: false,
                recentSales: false,
                topCampaigns: true,
                topTriggers: true,
                formatMedia: true,
                dropoffs: false,
                agesTimeline: false,
                genderTimeline: false
            };
        };

        this.getDefaultScansSetting = function () {
            return {
                isScans: true,
                //globe: true,
                //map: false,
                live: false,
                recentScans: true,
                realtimeScans: false,
                totalRevenues: false,
                scansTrends: true,
                weekDayScans: true,
                daytimesSales: false,
                daytimesTransaction: false,
                conversion: false,
                industryRanking: false,
                topProducts: false,
                topPartners: false,
                paymentMethods: false,
                topCountries: true,
                demographic: true,
                recentSales: false,
                topCampaigns: true,
                topTriggers: true,
                formatMedia: true,
                dropoffs: false,
                agesTimeline: true,
                genderTimeline: true
            };
        };

        this.getDefaultSalesSetting = function () {
            return {
                isScans: false,
                //globe: false,
                //map: true,
                live: false,
                recentScans: false,
                realtimeScans: false,
                totalRevenues: true,
                scansTrends: false,
                weekDayScans: false,
                daytimesSales: true,
                daytimesTransaction: true,
                conversion: true,
                industryRanking: false,
                topProducts: true,
                topPartners: false,
                paymentMethods: false,
                topCountries: true,
                demographic: true,
                recentSales: true,
                topCampaigns: false,
                topTriggers: false,
                formatMedia: false,
                dropoffs: false,
                agesTimeline: true,
                genderTimeline: true
            };
        };

        this.getConfigChartDefault = function () {
            return {
                options: {
                    chart: {
                        zoomType: 'xy'
                    },
                    title: {
                        align: 'left',
                        text: ''
                    },
                    credits: {
                        enabled: false
                    },
                    subtitle: {},
                    legend: {
                        enabled: false
                    },
                    xAxis: {
                        crosshair: true
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: ''
                        }
                    },
                    exporting: {
                        enabled: false
                    },
                    plotOptions: {
                        column: {
                            borderWidth: 0
                        }
                    },
                    tooltip: {
                        backgroundColor: '#1e2225',
                        borderColor: null,
                        borderRadius: 4,
                        borderWidth: 0,
                        useHTML: true,
                        style: {'width': '230px'},
                        pointFormat: '<div style="width:230px;padding:0;margin-top:-13px;z-index:9999;"><p class="txt-deep-grey" style="margin:0;"><span class="font-11 medium-font">{point.from_date}</span><span>-</span class="font-11 medium-font">{point.to_date}<span></span></p><p class="font-11 medium-font txt-grey over-text capitalize">All Campaigns</p><p class="margin-0 clearfix"><span class="txt-white">{point.y}</span><span class="pull-right increase {point.classUpDown}">{point.percent}%</span></p></div>'
                    }
                },
                series: [{
                    name: '',
                    data: []
                }],
                loading: false,
                useHighStocks: false,
                size: {}
            };
        };

        this.getTopCountriesConfigChart = function () {
            return {
                options: {
                    chart: {
                        height: 250
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        map: {
                            mapData: Highcharts.maps['custom/world'],
                            joinBy: ['name']
                        }
                    },
                    tooltip: {
                        enabled: false
                    },
                    colorAxis: {
                        minColor: '#40BFFF',
                        maxColor: '#134CBF'
                    },
                    exporting: {
                        enabled: false
                    }
                },
                chartType: 'map',
                title: {
                    text: ''
                },
                series: [{
                    data: []
                }],
                allAreas: true
            };
        };

        this.getConfigChartBoxDefault = function () {
            return {
                options: {
                    chart: {
                        height: 50
                    },
                    xAxis: {
                        visible: false
                    },
                    yAxis: {
                        visible: false
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        enabled: true,
                        shadow: false,
                        borderColor: '#CCCCCC',
                        backgroundColor: '#ffffff',
                        borderWidth: 1,
                        formatter: function () {
                            return '<b>' + $filter('kmNumber')(this.y) + '</b>';
                        }
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                enabled: false
                            },
                            lineWidth: 2
                        }
                    },
                    rangeSelector: {
                        button: [{
                            type: 'month',
                            count: 1
                        }],
                        selected: 0
                    }
                },
                chartType: 'stockchart',
                title: {
                    text: ''
                },
                series: [{}]
            };
        };

        this.getAgesTimelineOptions = function (option) {
            return _.merge(option, {
                chart: {
                    type: 'column'
                },
                xAxis: {
                    categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
                },
                colors: ['#D2E600', '#49E000', '#2AA800', '#40BFFF', '#448AFF', '#134DBF'],
                yAxis: {
                    labels: {
                        format: '{value}k'
                    }
                },
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                },
                tooltip: {
                    pointFormat: '<div style="width:230px;padding:0;margin-top:-13px;"><p class="txt-deep-grey" style="margin:0;"><span class="font-11 medium-font">{series.name}</span></p><p class="font-11 medium-font txt-grey over-text capitalize">All Campaigns</p>' +
                    '<div class="grow-tooltip-chart font-11 clearfix"><div class="col-tooltip-chart txt-grey">18-24</div><div class="col-tooltip-chart txt-grey">82 150</div><div class="col-tooltip-chart txt-grey">28%</div><div class="col-tooltip-chart txt-grey decrease growthPercent">+1.7%<i class="ico-status ico-status-decrease"></i></div>' +
                    '</div><div class="grow-tooltip-chart font-11 clearfix"><div class="col-tooltip-chart txt-grey">25-34</div><div class="col-tooltip-chart txt-grey">68 774</div><div class="col-tooltip-chart txt-grey">25%</div><div class="col-tooltip-chart txt-grey increase growthPercent">+0.2%<i class="ico-status ico-status-increase"></i></div>' +
                    '</div><div class="grow-tooltip-chart font-11 clearfix"><div class="col-tooltip-chart txt-grey">35-44</div><div class="col-tooltip-chart txt-grey">34 526</div><div class="col-tooltip-chart txt-grey">17%</div><div class="col-tooltip-chart txt-grey decrease growthPercent">-11.3%<i class="ico-status ico-status-decrease"></i></div></div></div>'
                }
            });
        };

        this.getGenresOptions = function (option) {
            return _.merge(option, {
                chart: {
                    events: {
                        load: function () {
                            $timeout(function () {
                                $('.genres .highcharts-series-0').children().eq(1).css('display', 'none');
                                $('.genres .highcharts-series-1').children().eq(1).css('display', 'none');
                            }, 1000);
                        }
                    },
                    height: 185
                }
            });
        };

        this.getGenderTimelineOptions = function (option) {
            return _.merge(option, {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
                },
                yAxis: {
                    labels: {
                        format: '{value}k'
                    }
                },
                tooltip: {
                    pointFormat: '<div style="width:230px;padding:0;margin-top:-13px;"><p class="txt-deep-grey" style="margin:0;"><span class="font-11 medium-font">{point.from_date}</span><span class="font-11 medium-font">-</span><span class="font-11 medium-font">{point.to_date}</span></p><p class="font-11 medium-font txt-grey over-text capitalize">All Campaigns</p>' +
                    '<div class="grow-tooltip-chart font-11 clearfix"><div class="col-tooltip-chart txt-grey">MALE</div><div class="col-tooltip-chart txt-grey">82 150</div><div class="col-tooltip-chart txt-grey">28%</div><div class="col-tooltip-chart txt-grey decrease growthPercent">+1.7%<i class="ico-status ico-status-decrease"></i></div></div><div class="grow-tooltip-chart font-11 clearfix">' +
                    '<div class="col-tooltip-chart txt-grey">FEMALE</div><div class="col-tooltip-chart txt-grey">68 774</div><div class="col-tooltip-chart txt-grey">25%</div><div class="col-tooltip-chart txt-grey increase growthPercent">+0.2%<i class="ico-status ico-status-increase"></i></div></div><div class="grow-tooltip-chart font-11 clearfix"><div class="col-tooltip-chart txt-grey">ALL</div><div class="col-tooltip-chart txt-grey">34 526</div><div class="col-tooltip-chart txt-grey">17%</div><div class="col-tooltip-chart txt-grey decrease growthPercent">-11.3%<i class="ico-status ico-status-decrease"></i></div></div></div>'
                }
            });
        };

        this.getWeekDayScansOptions = function (option) {
            return _.merge(option, {
                chart: {
                    type: 'bar'
                },
                xAxis: {
                    categories: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
                },
                plotOptions: {
                    bar: {
                        states: {
                            hover: {
                                color: '#134DBF'
                            }
                        }
                    }
                },
                colors: ['#4398FF'],
                series: [{
                    data: []
                }]
            });
        };

        this.getAgesOptions = function (option) {
            return _.merge(option, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: 0,
                    plotShadow: false,
                    height: 250
                },
                plotOptions: {
                    pie: {
                        dataLabels: {
                            enabled: false
                        },
                        startAngle: 0,
                        endAngle: 360
                    }
                }
            });
        };

        this.getScansTrendsOptions = function (option) {
            return _.merge(option, {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    type: 'datetime'
                    //maxZoom: 3600 * 10
                },
                tooltip: {
                    backgroundColor: '#1e2225',
                    borderColor: null,
                    borderRadius: 4,
                    borderWidth: 0,
                    useHTML: true,
                    style: {'width': '230px'},
                    pointFormat: '<div style="width:230px;padding:0;margin-top:-13px;z-index:9999;"><p class="txt-deep-grey" style="margin:0;"><span class="font-11 medium-font">{point.from_date}</span><span>-</span class="font-11 medium-font">{point.to_date}<span></span></p><p class="font-11 medium-font txt-grey over-text capitalize">All Campaigns {point.hour}</p><p class="margin-0 clearfix"><span class="txt-white">{point.y}</span><span class="pull-right {point.classUpDown}">{point.percent}%</span></p></div>'
                }
            });
        };

        this.getPlatformChartOptions = function (option) {
            return _.merge(option, {
                chart: {
                    events: {
                        load: function () {
                            $timeout(function () {
                                $('.platfrom .highcharts-series-0').children().eq(1).css('display', 'none');
                                $('.platfrom .highcharts-series-1').children().eq(1).css('display', 'none');
                            }, 1000);
                        }
                    },
                    height: 185
                }
            });
        };

        this.getEducationChartOptions = function (option) {
            return _.merge(option, {
                chart: {
                    type: 'column',
                    height: 272
                },
                xAxis: {
                    visible: false
                },
                yAxis: {
                    visible: false
                }
            });
        };

        this.getGenresSeries = function () {
            return [{
                type: 'pie',
                innerSize: '87%',
                data: [
                    {name: '', y: 0, color: '#134DBF'},
                    {name: '', y: 100, color: '#FFFFFF'}
                ]
            }, {
                type: 'pie',
                innerSize: '87%',
                size: '80%',
                data: [
                    {name: '', y: 0, color: '#40BFFF'},
                    {name: '', y: 100, color: '#FFFFFF'}
                ]
            }];
        };

        this.getCommunityTypeDataDummy = function (nowDate, nowDateFrom) {
            return [{
                type: 'pie',
                innerSize: '87%',
                data: [
                    {name: '', y: 57, to_date: nowDate, from_date: nowDateFrom, color: '#134DBF', percent: 57},
                    {name: '', y: 43, color: '#FFFFFF'}
                ]
            }, {
                type: 'pie',
                innerSize: '87%',
                size: '80%',
                data: [
                    {name: '', y: 31, to_date: nowDate, from_date: nowDateFrom, color: '#40BFFF', percent: 31},
                    {name: '', y: 69, color: '#FFFFFF'}
                ]
            }, {
                type: 'pie',
                innerSize: '87%',
                size: '60%',
                data: [
                    {name: '', y: 22, to_date: nowDate, from_date: nowDateFrom, color: '#49E000', percent: 22},
                    {name: '', y: 78, color: '#FFFFFF'}
                ]
            }];
        };

        this.getAgesTimelineSeries = function () {
            return [{
                name: moment().tz("UTC").format('DD.MM.YYYY'),
                data: [1, 3, 4, 2, 2, 3, 3]
            }, {
                name: moment().tz("UTC").format('DD.MM.YYYY'),
                data: [2, 2, 3, 2, 1, 5, 6]
            }, {
                name: moment().tz("UTC").format('DD.MM.YYYY'),
                data: [3, 4, 4, 2, 5, 3, 5]
            }, {
                name: moment().tz("UTC").format('DD.MM.YYYY'),
                data: [2, 2, 3, 2, 1, 5, 6]
            }, {
                name: moment().tz("UTC").format('DD.MM.YYYY'),
                data: [3, 4, 4, 2, 5, 5, 6]
            }, {
                name: moment().tz("UTC").format('DD.MM.YYYY'),
                data: [3, 4, 4, 2, 5, 1, 4]
            }];
        };

        this.getAgesSeries = function () {
            return [{
                type: 'pie',
                name: '',
                innerSize: '70%',
                data: [
                    {name: '', y: 0, color: '#134DBF', icon: 'ico-age-18', age: '18-24'},
                    {name: '', y: 0, color: '#448AFF', icon: 'ico-age-25', age: '25-34'},
                    {name: '', y: 0, color: '#40BFFF', icon: 'ico-age-35', age: '35-44'},
                    {name: '', y: 0, color: '#2AA800', icon: 'ico-age-45', age: '45-54'},
                    {name: '', y: 0, color: '#49E000', icon: 'ico-age-55', age: '55-64'},
                    {name: '', y: 0, color: '#BFE600', icon: 'ico-age-65', age: '65+'}
                ]
            }];
        };

        this.getPaymentMethodsSeries = function () {
            return [{
                type: 'pie',
                name: '',
                innerSize: '10%',
                data: [
                    {name: '', y: 62, color: '#134DBF'},
                    {name: '', y: 17, color: '#448AFF'},
                    {name: '', y: 13, color: '#40BFFF'},
                    {name: '', y: 8, color: '#2AA800'}
                ]
            }];
        };

        this.getHouseholdIncomeSeries = function (nowDate, nowDateFrom) {
            return [{
                type: 'pie',
                name: '',
                innerSize: '70%',
                data: [
                    {name: '', y: 17, color: '#134DBF', to_date: nowDate, from_date: nowDateFrom, percent: 17},
                    {name: '', y: 45, color: '#448AFF', to_date: nowDate, from_date: nowDateFrom, percent: 45},
                    {name: '', y: 15, color: '#40BFFF', to_date: nowDate, from_date: nowDateFrom, percent: 15},
                    {name: '', y: 23, color: '#2AA800', to_date: nowDate, from_date: nowDateFrom, percent: 23}

                ]
            }];
        };

        this.getIconMarkerImage = function () {
            return ['content/images/map/m1.png', 'content/images/map/m2.png', 'content/images/map/m3.png', 'content/images/map/m4.png', 'content/images/map/m5.png'];
        };

        this.setSettingScans = function (settingScans) {
            this.settingScans = settingScans;
        };

        this.getSettingScans = function () {
            return this.settingScans;
        };

        this.setSettingSales = function (settingSales) {
            this.settingSales = settingSales;
        };

        this.getSettingSales = function () {
            return this.settingSales;
        };

        this.setSettingDashboard = function (settingDashboard) {
            this.settingDashboard = settingDashboard;
        };

        this.getSettingDashboard = function () {
            return this.settingDashboard;
        };

        this.setNumberSetting = function (settingNumber) {
            this.settingNumber = settingNumber;
        };

        this.getNumberSetting = function () {
            return this.settingNumber;
        };

        this.setPlatformChart = function (chart) {
            this.platformChart = chart;
        };

        this.getPlatformChart = function () {
            return this.platformChart;
        };

        this.setGenresChart = function (chart) {
            this.genresChart = chart;
        };

        this.getGenresChart = function () {
            return this.genresChart;
        };

        this.setAgesChart = function (chart) {
            this.agesChart = chart;
        };

        this.getAgesChart = function () {
            return this.agesChart;
        };

        this.setTimeRefreshing = function (timeRefreshing) {
            this.timeRefreshing = timeRefreshing;
        };

        this.getTimeRefreshing = function () {
            return this.timeRefreshing;
        };

        return {
            setSettingScans: this.setSettingScans,
            getSettingScans: this.getSettingScans,
            setSettingSales: this.setSettingSales,
            getSettingSales: this.getSettingSales,
            setTimeRefreshing: this.setTimeRefreshing,
            getTimeRefreshing: this.getTimeRefreshing,
            setSettingDashboard: this.setSettingDashboard,
            getSettingDashboard: this.getSettingDashboard,
            getDefaultScansSetting: this.getDefaultScansSetting,
            getDefaultSalesSetting: this.getDefaultSalesSetting,
            getDefaultScansSettingLive: this.getDefaultScansSettingLive,
            getDefaultNumberScansSetting: this.getDefaultNumberScansSetting,
            getDefaultNumberSalesSetting: this.getDefaultNumberSalesSetting,
            getConfigChartDefault: this.getConfigChartDefault,
            getObjectChart: this.getObjectChart,
            setNumberSetting: this.setNumberSetting,
            getNumberSetting: this.getNumberSetting,
            addRangeDate: this.addRangeDate,
            getTopCountriesConfigChart: this.getTopCountriesConfigChart,
            getNowDate: this.getNowDate,
            getConfigChartBoxDefault: this.getConfigChartBoxDefault,
            getAgesTimelineOptions: this.getAgesTimelineOptions,
            getGenderTimelineOptions: this.getGenderTimelineOptions,
            setPlatformChart: this.setPlatformChart,
            getPlatformChart: this.getPlatformChart,
            setGenresChart: this.setGenresChart,
            getGenresChart: this.getGenresChart,
            getCommunityTypeDataDummy: this.getCommunityTypeDataDummy,
            getGenresOptions: this.getGenresOptions,
            getWeekDayScansOptions: this.getWeekDayScansOptions,
            getAgesOptions: this.getAgesOptions,
            getScansTrendsOptions: this.getScansTrendsOptions,
            getIconMarkerImage: this.getIconMarkerImage,
            getPlatformChartOptions: this.getPlatformChartOptions,
            getEducationChartOptions: this.getEducationChartOptions,
            getGenresSeries: this.getGenresSeries,
            setAgesChart: this.setAgesChart,
            getAgesChart: this.getAgesChart,
            getAgesTimelineSeries: this.getAgesTimelineSeries,
            getAgesSeries: this.getAgesSeries,
            getPaymentMethodsSeries: this.getPaymentMethodsSeries,
            getHouseholdIncomeSeries: this.getHouseholdIncomeSeries
        };
    }]);

})(angular, _);
