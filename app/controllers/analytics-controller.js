(function (angular, _) {
    'use strict';

    var controllers = angular.module('controllers');

    controllers.controller('AnalyticsController', ['$rootScope', '$window', '$scope', '$state', '$interval', '$timeout', '$uibModal', '$filter', 'DashboardService', 'AnalyticsService', 'BrandService', 'CampaignService', 'PopupMessageService', 'appConfig',

        function ($rootScope, $window, $scope, $state, $interval, $timeout, $uibModal, $filter, DashboardService, AnalyticsService, BrandService, CampaignService, PopupMessageService, appConfig) {
            $scope.colorLineBlack = "#00a6da";
            $scope.colorSeriesChart = "#e5f6fb";
            $scope.colorGray = "#509ad9";

            var barChartConfig = {
                options: {
                    chart: {
                        type: 'column',
                        zoomType: 'xy'
                    },
                    title: {
                        align: 'left',
                        text: ''
                    },
                    xAxis: {
                        type: 'datetime',
                        crosshair: true
                    },
                    tooltip: {
                        borderColor: null,
                        borderRadius: 4,
                        borderWidth: 0,
                        useHTML: true,
                        style: {'width': '230px'}
                    },
                    credits: {
                        enabled: false
                    },
                    subtitle: {

                    },
                    legend: {
                        enabled: false
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: ''
                        },
                        opposite: false
                    },
                    exporting: {
                        enabled: false
                    },
                    plotOptions: {
                        column: {
                            borderWidth: 0
                        }
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

            $scope.areaChartConfig = {
                "options": {
                    "chart": {
                        "type": "area",
                        "zoomType": "xy"
                    },
                    "xAxis": {
                        "type": "datetime",
                        "crosshair": true
                    },
                    "yAxis": {
                        "opposite": false
                    },
                    "plotOptions": {
                        "series": {
                            "stacking": ""
                        }
                    },
                    "exporting": {
                        "enabled": false
                    },
                    "colors": [$scope.colorLineBlack]
                },
                "series": [
                    {
                        "data": [],
                        "id": "series-5",
                        "color": $scope.colorSeriesChart
                    }
                ],
                "title": {
                    "text": ""
                },
                "credits": {
                    "enabled": false
                },
                "loading": false,
                "size": {},
                "useHighStocks": false,
                func: function (chart) {

                }
            };

            $scope.summaryChart = angular.copy($scope.areaChartConfig);

            function updateSummaryChart() {
                var params = {
                    from_date: $scope.fromDate || '2015-01-01',
                    to_date: $scope.toDate || '2030-12-31'
                };

                var seriesData = [];
                DashboardService.getDashboard(params).then(function (res) {
                    angular.forEach(res, function (val, key) {
                        var item = [Date.parse(val.date), parseFloat(val.no_searches)];
                        seriesData.push(item);
                    });
                    $scope.summaryChart.series[0].data = seriesData;
                }, function (error) {
                    console.log(error)
                });
            }

            $scope.curTab = 1;
            $scope.setTab = function(currentActive) {
                $scope.curTab = currentActive;
            };

            var dateFrom = moment().startOf("year").format("YYYY-MM-DD");
            var dateTo = moment().endOf("year").format("YYYY-MM-DD");
            $scope.dateRangeOptions = {};
            $scope.dateRangeOptions.date = {
                format: 'YYYY-MM-DD',
                startDate: moment().startOf("year"),
                endDate: moment().endOf("year"),
                value: dateFrom + " - " + dateTo
            };

            $scope.dateRangeOptions.opts = {
                autoApply: true,
                alwaysShowCalendars: true,
                locale: {
                    applyClass: 'btn-green',
                    applyLabel: "Apply",
                    fromLabel: "From",
                    format: "YYYY-MM-DD",
                    toLabel: "To",
                    cancelLabel: 'Cancel',
                    customRangeLabel: 'Custom range'
                },
                ranges: {
                    'Yesterday': [moment().subtract(1, 'days'), moment()],
                    'Last Month': [moment().subtract(29, 'days'), moment()],
                    'Last 3 Months': [moment().subtract(89, 'days'), moment()],
                    'Last Year': [moment().subtract(365, 'days'), moment()]
                }
            };

            $scope.$watch('dateRangeOptions.date', function (newDate) {
                $scope.fromDate = newDate.startDate.format("YYYY-MM-DD");
                $scope.toDate = newDate.endDate.format("YYYY-MM-DD");
                updateSummaryChart();
                updateSaleCharts();
                getAnalytics();
                getQueryList();
                if ($scope.appEs && $scope.appEs.length > 0) {
                    $scope.selectAppE($scope.appEs[0]);
                }
            }, false);

            function activeRefresh() {
                $interval(function () {
                    getQueryList();
                    getAnalytics();
                }, 60000)
            }

            function getAnalytics() {
                var params = '';
                if ($scope.fromDate && $scope.toDate) {
                    params = {
                        from_date: $scope.fromDate,
                        to_date: $scope.toDate
                    }
                } else {
                    return;
                }
                AnalyticsService.getAnalytics(params).then(function (result) {
                    $scope.analytics = result;
                    analyticsTrends();
                    analyticsGender();
                    analyticsAge();
                    analyticsCountries();
                    analyticsWeekdaySearches();
                    analyticsPlatform();
                    analyticsEngagements();

                }, function (err) {
                    console.log(err);
                });
            }

            function getQueryList() {
                angular.forEach($scope.myMarkers, function (marker) {
                    marker.setMap(null);
                });

                var params;
                if ($scope.fromDate && $scope.toDate) {
                    params = {
                        from_date: $scope.fromDate,
                        to_date: $scope.toDate
                    };
                } else {
                    return;
                }

                AnalyticsService.getQueryList(params).then(function (list) {
                    $scope.querryList = list;

                    if ($scope.querryList.results.length > 0) {

                        var qLatCounts = {}, qLongCounts = {};
                        _.forEach($scope.querryList.results, function (x) {
                            qLatCounts[x.querry_latitude] = (qLatCounts[x.querry_latitude] || 0) + 1;
                            qLongCounts[x.querry_longitude] = (qLongCounts[x.querry_longitude] || 0) + 1;
                        });

                        var largestLat = getValueMax(qLatCounts);
                        var largestLong = getValueMax(qLongCounts);

                        var newPos = new google.maps.LatLng(largestLat.value, largestLong.value);
                        if ($scope.myMap) {
                            $scope.myMap.setOptions({
                                center: newPos,
                                zoom: 12
                            });
                        }
                    }

                    angular.forEach($scope.querryList.results, function (item) {
                        $scope.setMarkerByLatLng(item.querry_latitude, item.querry_longitude);
                    })

                }, function (err) {
                    console.log(err);
                });
            }

            function getValueMax(obj) {
                var max = 0, item = {};
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        if (max < obj[key]) {
                            item = {
                                number: obj[key],
                                value: key
                            };
                            max = obj[key]
                        }
                    }
                }
                return item;
            }

            // Section google map
            $scope.myMarkers = [];

            $scope.mapOptions = {
                center: new google.maps.LatLng(35.784, -78.670),
                zoom: 3,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.addMarker = function ($event, $params) {
                // $scope.myMarkers.push(new google.maps.Marker({
                //   map: $scope.myMap,
                //   position: $params[0].latLng
                // }));
            };

            $scope.setZoomMessage = function (zoom) {
                $scope.zoomMessage = 'You just zoomed to ' + zoom + '!';
            };

            $scope.openMarkerInfo = function (marker) {
                $scope.currentMarker = marker;
                $scope.currentMarkerLat = marker.getPosition().lat();
                $scope.currentMarkerLng = marker.getPosition().lng();
                $scope.myInfoWindow.open($scope.myMap, marker);
            };

            $scope.setMarkerPosition = function (marker, lat, lng) {
                marker.setPosition(new google.maps.LatLng(lat, lng));
            };

            $scope.setMarkerByLatLng = function (lat, lng) {
                var marker = new google.maps.Marker({
                    map: $scope.myMap,
                    position: new google.maps.LatLng(lat, lng)
                });

                $scope.myMarkers.push(marker);
            };

            $scope.chartColumnConfig = {
                options: {
                    chart: {
                        type: 'column'
                    },
                    xAxis: {
                        categories: []
                    },
                    yAxis: {
                        min: 0, max: 100
                    },
                    colors: [$scope.colorBlackChart],
                    plotOptions: {
                        series: {
                            stacking: '',
                            showInLegend: false
                        }
                    },
                    exporting: {
                        enabled: false
                    },
                    style: {
                        width: '100%'
                    }
                },
                series: [],
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                loading: true,
                useHighStocks: false,
                size: {},

                func: function (chart) {
                    $timeout(function () {
                        chart.reflow();
                        //The below is an event that will trigger all instances of charts to reflow
                        $scope.$broadcast('highchartsng.reflow');
                    }, 10);
                }
            };

            $scope.analyticsTrends = analyticsTrends;
            $scope.chartTrendsConfig = angular.copy($scope.areaChartConfig);
            function analyticsTrends() {
                $scope.analyticsTrendsData = [
                    {
                        "name": "Search Trends",
                        "data": [],
                        "color": $scope.colorSeriesChart
                    }
                ];

                if ($scope.analytics.trends) {
                    var trends = $scope.analytics.trends,
                        data = [],
                        weekDays = [];

                    if (trends !== 'undefined' && trends.length > 0) {
                        angular.forEach(trends, function (val, key) {
                            $scope.analyticsTrendsData[0].data.push(val.percent);
                            weekDays.push(val.query_day_name);
                        });
                    }

                    $scope.chartTrendsConfig.options.xAxis.categories = weekDays;
                    $scope.chartTrendsConfig.series = $scope.analyticsTrendsData;
                    $scope.chartTrendsConfig.loading = false;
                    $scope.isLoadingTrends = false;
                }
            }

            var countries = {
                    europe: 'France, Germany, Russia',
                    asia: 'Japan, China'
                },
                defaultSeriesData = {
                    allAreas: false,
                    name: '',
                    countries: '',
                    data: [],
                    color: $scope.colorLineBlack,
                    dataLabels: {
                        enabled: true,
                        color: 'white',
                        formatter: function () {
                            if (this.point.value) {
                                return this.point.name;
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        headerFormat: '',
                        pointFormat: '{point.name}: <b>{point.value}</b>'
                    }
                };
            $scope.configMap = {
                options: {
                    legend: {
                        enabled: false
                    },
                    plotOptions: {
                        map: {
                            mapData: Highcharts.maps['custom/world'],
                            joinBy: ['name']
                        }
                    }
                },
                chartType: 'map',
                title: {
                    text: ''
                },
                series: [
                    // makeSeries('Europe', countries.europe),
                    // makeSeries('Asia', countries.asia)
                ]
            };

            function makeSeriesData(string) {
                var list = ('' + string).split(','),
                    data = []
                    ;

                angular.forEach(list, function (country) {
                    data.push({
                        name: country.replace(/^\s+|\s+$/, ''),
                        value: 1
                    });
                });
                return data;
            }

            $scope.analyticsCountries = analyticsCountries;
            $scope.chartCountriesConfig = angular.copy($scope.configMap);
            function analyticsCountries() {
                $scope.analyticsCountriesData = [];


                if ($scope.analytics.top_countries) {
                    var topcountries = $scope.analytics.top_countries,
                        data = [],
                        countriesT = [],
                        counter = 0;


                    if (topcountries !== 'undefined' && topcountries.length > 0) {
                        angular.forEach(topcountries, function (val, key) {
                            if (val.query_country == 'Hong Kong')
                                val.query_country = "China";
                            // $scope.analyticsCountriesData[0].data.push(val.percent);
                            countriesT.push({name: val.query_country, value: val.percent});
                        });
                    }
                    var seriesData = angular.copy(defaultSeriesData);
                    seriesData.name = "Europe";
                    seriesData.countries = countries.europe;
                    seriesData.data = countriesT;
                    console.log(seriesData.data)
                    // $scope.chartCountriesConfig.options.xAxis.categories = countries;
                    $scope.chartCountriesConfig.series[0] = seriesData;
                    $scope.chartCountriesConfig.loading = false;
                    $scope.chartCountriesConfig.series[0].allAreas = true;
                }
            }

            $scope.analyticsWeekdaySearches = analyticsWeekdaySearches;
            $scope.chartWeekdaySearchesConfig = angular.copy($scope.areaChartConfig);
            function analyticsWeekdaySearches() {
                $scope.analyticsWeekdaySearchesData = [];

                if ($scope.analytics) {
                    var weekDaysList = $scope.analytics.weekdays,
                        weekDays = [];


                    if (weekDaysList !== 'undefined' && weekDaysList.length > 0) {
                        angular.forEach(weekDaysList, function (val, key) {
                            $scope.analyticsWeekdaySearchesData.push(val.percent);
                            weekDays.push(val.query_day_name);
                        });
                    }
                    $scope.chartWeekdaySearchesConfig.options.xAxis.categories = weekDays;
                    $scope.chartWeekdaySearchesConfig.series[0].name = "Weekday Searches";
                    $scope.chartWeekdaySearchesConfig.series[0].data = $scope.analyticsWeekdaySearchesData;
                    $scope.chartWeekdaySearchesConfig.loading = false;
                    $scope.chartWeekdaySearchesConfig.options.yAxis = {min: 0, max: 100};
                }
            }

            $scope.solidGaugeChart = {
                options: {
                    chart: {
                        type: 'solidgauge'
                    },
                    exporting: {
                        enabled: false
                    },
                    colors: [$scope.colorBlackChart],
                    printButton: {
                        enabled: false
                    },
                    exportButton: {
                        enabled: false
                    },
                    title: null,
                    credits: {
                        enabled: false
                    },
                    pane: {
                        size: '100%',
                        startAngle: -90,
                        endAngle: 90,
                        background: {
                            backgroundColor: $scope.colorGray,
                            innerRadius: '90%',
                            outerRadius: '100%',
                            shape: 'arc'
                        }
                    },
                    solidgauge: {
                        dataLabels: {
                            y: -30,
                            borderWidth: 0,
                            useHTML: true
                        }
                    }
                },
                series: [{
                    data: [],
                    dataLabels: '',
                    tooltip: null
                }],
                title: null,
                yAxis: {
                    y: 20,
                    lineWidth: 0,
                    minorTickInterval: null,
                    tickPixelInterval: 400,
                    tickWidth: 0,
                    min: 0,
                    max: 100,
                    labels: {},
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                borderWidth: 0,
                                useHTML: true
                            }
                        }
                    }
                },
                loading: false,
                size: {}
            };

            $scope.analyticsActivity = analyticsActivity;
            function analyticsActivity() {
                $scope.chartActivityConfig = angular.copy($scope.solidGaugeChart);
                $scope.chartActivityConfig.options.pane = {
                    startAngle: 0,
                    endAngle: 360,
                    background: [{ // Track for Move
                        outerRadius: '112%',
                        innerRadius: '88%',
                        backgroundColor: "#d0eafa",
                        borderWidth: 0
                    }, { // Track for Exercise
                        outerRadius: '87%',
                        innerRadius: '63%',
                        backgroundColor: "#c7c7c8",
                        borderWidth: 0
                    }, { // Track for Stand
                        outerRadius: '62%',
                        innerRadius: '38%',
                        backgroundColor: "#cefcd5",
                        borderWidth: 0
                    }]
                };
                $scope.chartActivityConfig.series = [];
                $scope.chartActivityConfig.loading = false;
                $scope.chartActivityConfig.func = function (chart) {
                    // // Move icon
                    //  chart.renderer.path(['M', -8, 0, 'L', 8, 0, 'M', 0, -8, 'L', 8, 0, 0, 8])
                    //      .attr({
                    //          'stroke': '#303030',
                    //          'stroke-linecap': 'round',
                    //          'stroke-linejoin': 'round',
                    //          'stroke-width': 2,
                    //          'zIndex': 10
                    //      })
                    //      .translate(190, chart.plotLeft +40)
                    //      .add();
                };


                if ($scope.analytics.activity) {
                    var myActivities = $scope.analytics.activity,
                        dataActivities = [],
                        inRadius = '0%',
                        rdius = '0%',
                        colorFill = '#55b6ee';

                    if (myActivities !== 'undefined' && myActivities.length > 0) {
                        _.forEach(myActivities, function (it, index) {
                            if (index == 0) {
                                inRadius = '112%';
                                rdius = '88%';
                                colorFill = '#55b6ee';
                            }
                            if (index == 1) {
                                inRadius = '63%';
                                rdius = '87%';
                                colorFill = '#424247';
                            }
                            if (index == 2) {
                                inRadius = '38%';
                                rdius = '62%';
                                colorFill = '#1ff674';
                            }
                            var item = {
                                name: it.name,
                                innerRadius: inRadius,
                                data: [{y: it.percent, color: colorFill, x: it.count}],
                                radius: rdius,
                                dataLabels: {
                                    format: '<div style="text-align:center;">100%</div>'
                                },
                                tooltip: {
                                    // valueSuffix: ' km/h',
                                    pointFormat: '{series.name}: <b>{point.x} </b><br/>',
                                }
                            };
                            dataActivities.push(item);
                        });

                        $scope.chartActivityConfig.series = dataActivities;
                    }
                }
            }

            $scope.pieChart = {
                "options": {
                    "chart": {
                        "type": "areaspline"
                    },
                    exporting: {
                        enabled: false
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    }
                },
                "series": [
                    {
                        name: null,
                        "data": [],
                        "id": "series-0",
                        "type": "pie"
                    }
                ],
                "title": {
                    "text": ""
                },
                "credits": {
                    "enabled": false
                },
                "loading": false,
                "size": {}
            };

            $scope.analyticsMyCampaign = analyticsMyCampaign;
            function analyticsMyCampaign() {
                $scope.chartMyCampaignConfig = angular.copy($scope.pieChart);
                if ($scope.analytics.top_campaigns) {
                    var myCampaings = $scope.analytics.top_campaigns,
                        dataCampaings = [];

                    if (myCampaings !== 'undefined' && myCampaings.length > 0) {
                        _.forEach(myCampaings, function (it, index) {
                            var colorFill = "#cccccc";
                            var item = {
                                name: it.campaign_title,
                                y: it.percent,
                                x: it.no_searches
                            };
                            dataCampaings.push(item);
                        });

                        $scope.chartMyCampaignConfig.series[0].data = dataCampaings;
                        $scope.chartMyCampaignConfig.series[0].tooltip = {
                            pointFormat: 'no_searches: <b>{point.x}</b><br/>'
                        }

                    }
                }
            }

            $scope.analyticsMostActivity = analyticsMostActivity;
            function analyticsMostActivity() {
                $scope.chartMostActivityConfig = angular.copy($scope.pieChart);

                if ($scope.analytics.top_hours) {
                    var myMostActivities = $scope.analytics.top_hours,
                        dataMostActivities = [];

                    if (myMostActivities !== 'undefined' && myMostActivities.length > 0) {
                        _.forEach(myMostActivities, function (it, index) {
                            var item = {
                                name: it.query_hour + 'h',
                                y: it.percent
                            };
                            dataMostActivities.push(item);
                        });

                        $scope.chartMostActivityConfig.series[0].data = dataMostActivities;
                    }
                }

            }

            $scope.analyticsGender = analyticsGender;
            function analyticsGender() {
                $scope.chartGenderConfig = angular.copy($scope.solidGaugeChart);
                $scope.maleNum = 0;
                $scope.femaleNum = 0;
                if ($scope.analytics.genders) {
                    var gendersList = $scope.analytics.genders,
                        data = [],
                        percent = 0;


                    if (gendersList !== 'undefined' && gendersList.length > 0) {
                        angular.forEach(gendersList, function (val, key) {
                            if (val.gender == 'male') {
                                $scope.maleNum = val.percent;
                            }
                            if (val.gender == 'female') {
                                $scope.femaleNum = val.percent;
                            }
                        });
                    }
                }
                $scope.chartGenderConfig.series[0].data = [$scope.maleNum];
                $scope.chartGenderConfig.yAxis.labels = {
                    y: 10,
                    formatter: function () {
                        if (this.value === 0) {
                            return ['<div style="display: flex;align-items: center;margin-top: 5px;">',
                                '<img src="content/images/gender-male-active.png" width="30px" />',
                                '<div style="font-weight:bold;"><div>' + $scope.maleNum + '</div><div style="color: rgb(204, 204, 204)"> Male</div></div>',

                                '</div>'].join('');
                        }

                        if (this.value === 100) {
                            return ['<div style="display: flex;align-items: center;margin-top: 5px;">',
                                '<div style="font-weight:bold;"><div>' + $scope.femaleNum + '</div><div style="color: rgb(204, 204, 204)"> Female</div></div>',
                                '<img src="content/images/gender-female-active.png" width=30px" />',

                                '</div>'].join('');
                        }

                        return this.value;
                    },
                    enabled: true,
                    useHTML: true
                };

                $scope.chartGenderConfig.options.pane.center = ['50%', '65%'];
                $scope.chartGenderConfig.loading = false;
                $scope.chartGenderConfig.size.height = 400;

            }

            $scope.analyticsAge = analyticsAge();
            function analyticsAge() {
                $scope.chartAgeConfig = {};
                $scope.chartAgeConfig = angular.copy($scope.solidGaugeChart);
                $scope.chartAgeConfig.options.pane.startAngle = -180;
                $scope.chartAgeConfig.options.pane.endAngle = 180;
                $scope.chartAgeConfig.loading = false;
                $scope.chartAgeConfig.size.height = 250;
                $scope.chartAgeConfig.options.pane.center = ['50%', '45%'];

                $scope.chartAgeConfig.A1 = angular.copy($scope.chartAgeConfig);
                $scope.chartAgeConfig.A2 = angular.copy($scope.chartAgeConfig);
                $scope.chartAgeConfig.A3 = angular.copy($scope.chartAgeConfig);
                $scope.chartAgeConfig.A4 = angular.copy($scope.chartAgeConfig);

                if ($scope.analytics) {
                    $scope.chartAgeConfig.A1.series = [{
                        name: $scope.analytics.ages[0].age,
                        data: [$scope.analytics.ages[0].percent],
                        dataLabels: {
                            y: -18,
                            format: '<div style="text-align:center;">{y:.1f}%</div><br/><div style="text-align:center;font-size:8px">' + $scope.analytics.ages[0].age + '</div>'
                        }
                    }];

                    $scope.chartAgeConfig.A2.series = [{
                        name: $scope.analytics.ages[1].age,
                        data: [$scope.analytics.ages[1].percent],
                        dataLabels: {
                            y: -18,
                            format: '<div style="text-align:center;">{y:.1f}%</div><br/><div style="text-align:center;font-size:8px">' + $scope.analytics.ages[1].age + '</div>'
                        }
                    }];

                    $scope.chartAgeConfig.A3.series = [{
                        name: $scope.analytics.ages[2].age,
                        data: [$scope.analytics.ages[2].percent],
                        dataLabels: {
                            y: -18,
                            format: '<div style="text-align:center;">{y:.1f}%</div><br/><div style="text-align:center;font-size:8px">' + $scope.analytics.ages[2].age + '</div>'
                        }
                    }];

                    $scope.chartAgeConfig.A4.series = [{
                        name: $scope.analytics.ages[3].age,
                        data: [$scope.analytics.ages[3].percent],
                        dataLabels: {
                            y: -18,
                            format: '<div style="text-align:center;">{y:.1f}%</div><br/><div style="text-align:center;font-size:8px">' + $scope.analytics.ages[3].age + '</div>'
                        }
                    }];
                }
            }

            $scope.analyticsPlatform = analyticsPlatform();
            function analyticsPlatform() {
                $scope.androidNum = 0;
                $scope.iOSNum = 0;
                $scope.chartPlatformConfig = angular.copy($scope.solidGaugeChart);
                if ($scope.analytics) {
                    var platformList = $scope.analytics.top_phone_types,
                        data = [],
                        percent = 0;


                    if (platformList !== 'undefined' && platformList.length > 0) {
                        angular.forEach(platformList, function (val, key) {
                            if (val.query_phone_type == 'Android') {
                                $scope.androidNum = val.percent;
                            }
                            if (val.query_phone_type == 'iOS') {
                                $scope.iOSNum = val.percent;
                            }
                        });
                    }
                }
                $scope.chartPlatformConfig.series[0].name = "Android";
                $scope.chartPlatformConfig.series[0].data = [$scope.androidNum];
                $scope.chartPlatformConfig.yAxis.labels = {
                    y: 10,
                    formatter: function () {
                        if (this.value === 0) {
                            return ['<div style="display: flex;align-items: center;margin-top: 5px;">',
                                '<img src="content/images/android-icon.png" width="30px" />',
                                '<div style="font-weight:bold;"><div>' + $scope.androidNum + '</div><div style="color: rgb(204, 204, 204)">Android</div></div>',

                                '</div>'].join('');
                        }

                        if (this.value === 100) {
                            return ['<div style="display: flex;align-items: center;margin-top: 5px;">',
                                '<div style="font-weight:bold;"><div>' + $scope.iOSNum + '</div><div style="color: rgb(204, 204, 204)">iOS</div></div>',
                                '<img src="content/images/iOS-icon.png" width="30px" />',

                                '</div>'].join('');
                        }

                        return this.value;
                    },
                    enabled: true,
                    useHTML: true
                };

                $scope.chartPlatformConfig.options.pane.center = ['50%', '65%'];
                $scope.chartPlatformConfig.loading = false;
            }

            // Engagement
            $scope.chartEngagementConfig = angular.copy($scope.chartColumnConfig);

            function analyticsEngagements() {
                var textConditions;
                if ($scope.fromDate && $scope.toDate) {
                    textConditions = '{"day":["between","' + $scope.fromDate + '","' + $scope.toDate + '"]}';
                } else {
                    return;
                }

                var params = {
                    data: {
                        app_id: $scope.app_id || appConfig.appSettingAnalytics,
                        dimensions: $scope.sessionEngagement || "session_length",
                        metrics: "users",
                        conditions: textConditions
                    }
                };
                AnalyticsService.getEngagements(params).then(function (response) {
                    $scope.engagementResult = response.results.results;
                    $scope.analyticsEngagementData = [
                        {
                            "name": "engagement",
                            "data": []
                        }
                    ];
                    if ($scope.engagementResult) {
                        var engagementList = $scope.engagementResult,
                            data = [],
                            engagements = [],
                            axisX = 0.8,
                            counter = 0;


                        if (engagementList !== 'undefined' && engagementList.length > 0) {
                            angular.forEach(engagementList, function (val, key) {
                                $scope.analyticsEngagementData[0].data.push(val.users);
                                engagements.push(val.session_length_description);
                            });
                        }
                        $scope.chartEngagementConfig.options.xAxis.categories = engagements;
                        $scope.chartEngagementConfig.series = $scope.analyticsEngagementData;
                        $scope.chartEngagementConfig.loading = false;
                        $scope.chartEngagementConfig.options.yAxis.max = null;

                    }
                });
            }

            $scope.engagementFilters = {
                sessions: [
                    {id: 1, value: 'session_length', name: 'Session length'},
                    {id: 2, value: 'session_interval', name: 'Session Interval'},
                    {id: 3, value: 'loyalty', name: 'Loyalty'}
                ]
            };

            $scope.sessionESel = $scope.engagementFilters.sessions[0];

            $scope.selectSession = function (session) {
                $scope.sessionESel = session;
                $scope.sessionEngagement = session.value;
                analyticsEngagements();
            };

            $scope.selectAppE = function(appE) {
                $scope.appEngagement = appE;
                $scope.app_id = appE.app_id;
                analyticsEngagements();
                getTotalOccurrences();
            };

            function getAppList() {
                var params = {};
                AnalyticsService.getApps(params).then(function (response) {
                    $scope.appEs = response.results;
                    if ($scope.appEs && $scope.appEs.length > 0) {
                        $scope.selectAppE($scope.appEs[0]);
                    }
                })
            }

            function getTotalOccurrences() {
                var textConditions;
                if ($scope.fromDate && $scope.toDate) {
                    textConditions = '{"day":["between","' + $scope.fromDate + '","' + $scope.toDate + '"]}';
                } else {
                    return;
                }

                var params = {
                    data: {
                        app_id: $scope.app_id || appConfig.appSettingAnalytics,
                        dimensions: "event_name",
                        metrics: "occurrences",
                        conditions: textConditions
                    }
                };

                AnalyticsService.getEngagements(params).then(function (response) {
                    $scope.occurrences = response.results.results;
                    var totalNumber = 0;

                    angular.forEach($scope.occurrences, function (val, key) {
                        totalNumber += parseInt(val.occurrences);
                    });

                    $scope.newOccurrences = _.map($scope.occurrences, function (occ) {
                        return {
                            event_name: occ.event_name,
                            occurrences: occ.occurrences,
                            percent: parseInt(occ.occurrences) * 100 / totalNumber
                        };
                    })

                })
            }

            $scope.exportToCSVFile = function () {
                var dataString = "";
                var data = $scope.newOccurrences;
                var csvContent = "data:text/csv;charset=utf-8,";
                csvContent += "Screen,Count,Percent \n";

                angular.forEach(data, function (item, index) {
                    dataString = item.event_name + "," + item.occurrences + "," + item.percent
                    csvContent += index < data.length ? dataString + "\n" : dataString;
                })

                var encodedUri = encodeURI(csvContent);
                var link = document.createElement("a");
                link.setAttribute("target", "_blank")
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "occurrences.csv");
                link.click();
            };

            $scope.paramFO = {
                app_id: $scope.app_id || appConfig.appSettingAnalytics,
                dimensions: "screen_1",
                metrics: "count_metric",
                conditions: '{"screen_0":"__Localytics_Start__"}'
            };

            $scope.mainFollowOverview = {
                caption: "Start Session",
                description: "FEATURE_CAMPAIGNS"
            };
            var lbEndSession = 'End_Session';
            var lbAllOther = 'All_Other';

            $scope.followOverview = followOverview();

            function followOverview() {
                var query = {
                    // api_key: "b0f12138ea8c15d57ded35e-1e665a7e-b45c-11e5-8bcc-00736b041834",
                    // api_secret: "658d678d068c9b8fa0be212-1e665d9e-b45c-11e5-8bcc-00736b041834",
                    data: $scope.paramFO
                };

                AnalyticsService.getEngagements(query).then(function (response) {
                    $scope.screenFollow = response.results.results;
                    if (!$scope.screenFollow)
                        return;

                    $scope.screenFollowCustom = $filter('orderBy')($scope.screenFollow, '-count_metric');
                    console.log($scope.screenFollowCustom);
                    $scope.totalRemainScreenFollow = 0;
                    angular.forEach($scope.screenFollowCustom, function (item, index) {
                        if (index > 4) {
                            $scope.totalRemainScreenFollow += parseInt(item.count_metric);
                        }
                    });

                    var totalNumber = 0;

                    angular.forEach($scope.screenFollowCustom, function (val, key) {
                        totalNumber += parseInt(val.count_metric);
                    });

                    $scope.renderFollow = [];
                    if (!$scope.screenFollowCustom) {
                        return;
                    }
                    var totalLength = $scope.screenFollowCustom.length > 5 ? 5 : $scope.screenFollowCustom.length;
                    for (var i = 0; i < totalLength; i++) {
                        var myOject = $scope.screenFollowCustom[i];
                        var objKey = Object.keys(myOject);
                        var arrDes = response.results.query.dimensions[0].split("_");
                        var dimensions = arrDes[0] + "_" + (parseInt(arrDes[1]) + 1);
                        var item = {
                            count: parseInt(myOject[objKey[0]]) * 100 / totalNumber,
                            name: myOject[objKey[1]] == '__Localytics_End__' ? lbEndSession : myOject[objKey[1]],
                            dimensions: dimensions,
                            metrics: response.results.query.metrics[0] || $scope.paramFO.metrics,
                            conditions: '{"' + response.results.query.dimensions[0] + '":"' + myOject[objKey[1]] + '"}',
                            subSecond: []
                        };
                        $scope.renderFollow.push(item);
                    }

                    $scope.renderFollow.push({
                        count: parseInt($scope.totalRemainScreenFollow) * 100 / totalNumber,
                        name: lbAllOther,
                    });
                    $timeout(function () {
                        $scope.orgchart = $("#basic-chart-source").orgChart({
                            container: $("#chart"),
                            nodeClicked: onNodeClicked
                        });
                    }, 1000);

                    // renderFollowChart();
                })
            }

            function onNodeClicked($node, $view) {
                var nodeCur = $node.clone().children("ul,li").remove().end();
                var count = nodeCur.find('.count:first').text();
                var name = nodeCur.find('.name:first').text();
                var dimensions = nodeCur.find('.dimensions:first').text();
                var metrics = nodeCur.find('.metrics:first').text();
                var conditions = nodeCur.find('.conditions:first').text();

                $scope.paramFO = {
                    app_id: $scope.app_id || appConfig.appSettingAnalytics,
                    dimensions: dimensions,
                    metrics: metrics,
                    conditions: conditions
                }
                console.log($scope.paramFO)

                var query = {
                    data: $scope.paramFO
                };

                if (name == lbEndSession || name == lbAllOther)
                    return false;

                AnalyticsService.getEngagements(query).then(function (response) {
                    if (!response.results.results || response.results.results.length <= 0) {
                        return false;
                    }
                    var dataResults = $filter('orderBy')(response.results.results, '-count_metric');
                    var totalLength = dataResults.length > 5 ? 5 : dataResults.length;

                    var totalNumber = 0;

                    angular.forEach(dataResults, function (val, key) {
                        totalNumber += parseInt(val.count_metric);
                    });

                    for (var i = 0; i < totalLength; i++) {
                        if ($scope.paramFO.dimensions == "screen_2") {
                            angular.forEach($scope.renderFollow, function (itemMain, index) {
                                if (itemMain.name == name && itemMain.subSecond.length < 5) {
                                    var myOject = dataResults[i];
                                    var objKey = Object.keys(myOject);
                                    var arrDes = response.results.query.dimensions[0].split("_");
                                    var dimensions = arrDes[0] + "_" + (parseInt(arrDes[1]) + 1);
                                    var item = {
                                        count: parseInt(myOject[objKey[0]]) * 100 / totalNumber,
                                        name: myOject[objKey[1]] == '__Localytics_End__' ? lbEndSession : myOject[objKey[1]],
                                        dimensions: dimensions,
                                        metrics: response.results.query.metrics[0] || $scope.paramFO.metrics,
                                        conditions: '{"' + response.results.query.dimensions[0] + '":"' + myOject[objKey[1]] + '"}',
                                        subThird: []
                                    };
                                    itemMain.subSecond.push(item);
                                } else {
                                    itemMain.subSecond = [];
                                }
                            })
                        }
                        if ($scope.paramFO.dimensions == "screen_3") {
                            var subSecond = [];
                            angular.forEach($scope.renderFollow, function (item, index) {
                                if (item.subSecond.length > 0) {
                                    subSecond = item.subSecond;
                                }
                            })

                            angular.forEach(subSecond, function (itemMain, index) {
                                if (itemMain.name == name && itemMain.subThird.length < 5) {
                                    var myOject = dataResults[i];
                                    var objKey = Object.keys(myOject);
                                    var arrDes = response.results.query.dimensions[0].split("_");
                                    var dimensions = arrDes[0] + "_" + (parseInt(arrDes[1]) + 1);
                                    var item = {
                                        count: parseInt(myOject[objKey[0]]) * 100 / totalNumber,
                                        name: myOject[objKey[1]] == '__Localytics_End__' ? lbEndSession : myOject[objKey[1]],
                                        dimensions: dimensions,
                                        metrics: response.results.query.metrics[0] || $scope.paramFO.metrics,
                                        conditions: '{"' + response.results.query.dimensions[0] + '":"' + myOject[objKey[1]] + '"}',
                                        subFour: []
                                    };
                                    itemMain.subThird.push(item);
                                } else {
                                    itemMain.subThird = [];
                                }
                            })
                        }

                        if ($scope.paramFO.dimensions == "screen_4") {
                            var subThird = [];
                            angular.forEach($scope.renderFollow, function (item, index) {
                                if (item.subSecond.length > 0) {
                                    angular.forEach(item.subSecond, function (it, idx) {
                                        if (it.subThird.length > 0) {
                                            subThird = it.subThird;
                                        }
                                    })
                                }
                            });

                            angular.forEach(subThird, function (itemMain, index) {
                                if (itemMain.name == name && itemMain.subFour.length < 5) {
                                    var myOject = dataResults[i];
                                    var objKey = Object.keys(myOject);
                                    var arrDes = response.results.query.dimensions[0].split("_");
                                    var dimensions = arrDes[0] + "_" + (parseInt(arrDes[1]) + 1);
                                    var item = {
                                        count: parseInt(myOject[objKey[0]]) * 100 / totalNumber,
                                        name: myOject[objKey[1]] == '__Localytics_End__' ? lbEndSession : myOject[objKey[1]],
                                        dimensions: dimensions,
                                        metrics: response.results.query.metrics[0] || $scope.paramFO.metrics,
                                        conditions: '{"' + response.results.query.dimensions[0] + '":"' + myOject[objKey[1]] + '"}',
                                        subFive: []
                                    };
                                    itemMain.subFour.push(item);
                                } else {
                                    itemMain.subFour = [];
                                }
                            })
                        }

                    }

                    $("#chart").empty();
                    $timeout(function () {
                        $scope.orgchart = $("#basic-chart-source").orgChart({
                            container: $("#chart"),
                            nodeClicked: onNodeClicked
                        });
                    }, 1000);
                })
            }

            function renderFollowChart() {

                // Demo data.
                var lpszDemoMaps = [];

                // Create params for root node.
                var nodeParams = {
                    options: {
                        targetName: "orgchart",
                        subTargetName: "orgnode",
                        clsName: "org-node",
                        width: 200,
                        height: 50,
                        maxWidth: 200,
                        maxHeight: 64,
                        template: ""
                    },
                    customParams: {
                        caption: "Start Session",
                        description: "FEATURE_CAMPAIGNS"
                    }
                };

                var pOrgNodes = new OrgNodeV2(nodeParams);

                // Create random children nodes.
                var pOrgChildNode = {};
                var pOrgChildNodes = null;
                var totalLength = $scope.screenFollowCustom.length > 5 ? 5 : $scope.screenFollowCustom.length;
                for (var i = 0; i < totalLength; i++) {
                    // var lpszDemoData = $scope.screenFollow[i];
                    var nodeChildParams = {
                        options: {
                            targetName: "orgchart",
                            subTargetName: "orgnode",
                            clsName: "org-node",
                            width: 16,
                            height: 16,
                            maxWidth: 0,
                            maxHeight: 0,
                            template: ""
                        },
                        customParams: {
                            caption: $scope.screenFollowCustom[i].count_metric,
                            description: $scope.screenFollowCustom[i].screen_1
                        }
                    };


                    pOrgChildNode = new OrgNodeV2(nodeChildParams);
                    pOrgNodes.addNodes(pOrgChildNode);

                }

                var nodeChildParams = {
                    options: {
                        targetName: "orgchart",
                        subTargetName: "orgnode",
                        clsName: "org-node",
                        width: 200,
                        height: 50,
                        maxWidth: 200,
                        maxHeight: 64,
                        template: ""
                    },
                    customParams: {
                        caption: $scope.totalRemainScreenFollow,
                        description: "Remain"
                    }
                };
                pOrgChildNode = new OrgNodeV2(nodeChildParams);
                pOrgNodes.addNodes(pOrgChildNode);


                var onclickNode = function (node, nodes) {
                    var nodeDes = node.currentTarget.getElementsByClassName("node-description")[0].innerText;
                    followOverviewStep2();
                }
                // Create params for chart.
                var chartParams = {
                    options: {
                        top: 12,
                        left: 12,
                        line: {
                            size: 2,
                            color: "#3388dd"
                        },
                        node: {
                            width: 100,
                            height: 100,
                            maxWidth: 100,
                            maxHeight: 100,
                            template: "<div id=\"{id}\" ><p class=\"node-caption\" >{caption}</p><span class=\"node-description\">{description}</span></div>"
                        }
                    },
                    event: {
                        node: {
                            onProcess: null,
                            onClick: onclickNode,
                            onMouseMove: null,
                            onMouseOver: null,
                            onMouseOut: null
                        },
                        onCreate: null,
                        onError: null,
                        onFinish: null
                    },
                    nodes: pOrgNodes
                };

                // Create OrgChartV2.
                var pChart = new OrgChartV2(chartParams);

                // Init.
                pChart.render();


            }

            $scope.resetDateRange = function() {
                $scope.dateRangeOptions.date = {
                    startDate: moment().startOf("year"),
                    endDate: moment().endOf("year"),
                    value: dateFrom + " - " + dateTo
                };
            };

            function createChartOptions(pointFormat) {
                var chartData;
                chartData = angular.copy(barChartConfig);
                chartData.options.tooltip.pointFormat = pointFormat;
                return chartData;
            }

            function updateSaleChart(chart, data) {
                var firstDataItem = data[0];
                var lastDataItem = data[data.length - 1];
                var beginDisplayDate = firstDataItem ? moment([moment().year(), firstDataItem.month - 1, firstDataItem.day]) : moment().tz('UTC');
                var endDisplayDate = lastDataItem ? moment([moment().year(), lastDataItem.month - 1, lastDataItem.day]) : moment().tz('UTC');

                var seriesData = [];
                for (var i = 0; i < endDisplayDate.diff(beginDisplayDate, 'days') + 1; i++) {
                    var pointData = {};
                    var foundDataItem;
                    var findingDate = beginDisplayDate.clone().add(i, 'days');
                    foundDataItem = _.find(data, function(item) {
                        return (findingDate.month() + 1) === parseInt(item.month) && findingDate.date() === parseInt(item.day);
                    });
                    if (foundDataItem) {
                        pointData.y = parseFloat(foundDataItem.result);
                    } else {
                        pointData.y = 0;
                    }
                    seriesData.push(pointData);
                }

                chart.series[0].pointInterval = 3600 * 1000 * 24; // 1 Day
                chart.series[0].pointStart = Date.UTC(beginDisplayDate.year(), beginDisplayDate.month(), beginDisplayDate.date(), 0, 0, 0);
                chart.series[0].data = seriesData;
            }

            var dollarFormat = '<b>{point.y}</b> $';
            var normalFormat = '<b>{point.y}</b>';

            $scope.totalRevenue = createChartOptions(dollarFormat);
            $scope.datetimeSales = createChartOptions(dollarFormat);
            $scope.datetimeTransactions = createChartOptions(normalFormat);

            function updateSaleCharts() {
                var params = {
                    from_date: $scope.fromDate || '2015-01-01',
                    to_date: $scope.toDate || '2030-12-31'
                };

                DashboardService.getTotalnumberSales(params).then(function (results) {
                    updateSaleChart($scope.totalRevenue, results.data_total_revenue);
                    updateSaleChart($scope.datetimeSales, results.data_avg_revenue_per_sale);
                    updateSaleChart($scope.datetimeTransactions, results.data_transactions);
                }, function (err) {
                    console.log(err);
                });
            }

            updateSaleCharts();
            updateSummaryChart();
            getAppList();
            getTotalOccurrences();
            getAnalytics();
            getQueryList();
            activeRefresh();
        }]);
})(angular, _);
