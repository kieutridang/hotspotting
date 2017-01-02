(function(angular, _) {
    'use strict';

    angular.module('dashboardModule').factory('DashboardModel', ['$filter', 'localStorageService', function($filter, localStorageService) {
        var model = this;

        this.scansSetting = {
            timeRefreshing: 1,
            activeUsers: true,
            demographic: true,
            campaigns: true,
            topTriggers: true
        };

        this.salesSetting = {
            timeRefreshing: 1,
            totalRevenue: true,
            conversion: true,
            daytimeSales: true,
            daytimeTransactions: true,
            demographic: true,
            topProducts: true
        };

        this.getScansSetting = function() {
            for (var item in model.scansSetting) {
                model.scansSetting[item] = localStorageService.get(PREFIXSCAN + item) || model.scansSetting[item];
            }
            return model.scansSetting;
        };

        this.setScansSetting = function(scansSetting) {
            model.scansSetting = scansSetting;
        };

        this.getSalesSetting = function() {
            for (var item in model.salesSetting) {
                model.salesSetting[item] = localStorageService.get(PREFIXSALE + item) || model.salesSetting[item];
            }
            return model.salesSetting;
        };

        this.setSalesSetting = function(salesSetting) {
            model.salesSetting = salesSetting;
        };

        this.getBoxChartConfig = function() {
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
                        formatter: function() {
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
                    }
                },
                chartType: 'stockchart',
                title: {
                    text: ''
                },
                series: [{}]
            };
        };

        this.getActiveUsersConfig = function() {
            return {
                options: {
                    xAxis: {
                        tickmarkPlacement: 'on',
                        type: 'datetime',
                        tickInterval: 24 * 3600 * 1000,
                        labels: {
                            formatter: function() {
                                return moment(this.value).format("MM/DD");
                            },
                            style: {
                                fontFamily: 'gotham'
                            }
                        }
                    },
                    yAxis: {
                        allowDecimals: false,
                        title: {
                            text: ''
                        },
                        labels: {
                            style: {
                                fontFamily: 'gotham'
                            }
                        },
                        opposite: false
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        align: 'right',
                        verticalAlign: 'top',
                        symbolHeight: 10,
                        symbolWidth: 0,
                        useHTML: true
                    },
                    tooltip: {
                        enabled: true,
                        shadow: false,
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                        useHTML: true,
                        style: {
                            fontFamily: 'gotham'
                        }
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                enabled: false
                            },
                            lineWidth: 2
                        }
                    }
                },
                chartType: 'stockchart',
                title: {
                    text: 'Active Users',
                    align: 'left',
                    style: {
                        fontFamily: 'gotham'
                    }
                },
                series: [{}]
            };
        };

        this.getTotalRevenueConfig = function() {
            return {
                options: {
                    xAxis: {
                        tickmarkPlacement: 'on',
                        type: 'datetime',
                        tickInterval: 24 * 3600 * 1000,
                        labels: {
                            formatter: function() {
                                return moment(this.value).format("MM/DD");
                            },
                            style: {
                                fontFamily: 'gotham'
                            }
                        }
                    },
                    yAxis: {
                        allowDecimals: false,
                        title: {
                            text: ''
                        },
                        labels: {
                            style: {
                                fontFamily: 'gotham'
                            }
                        },
                        opposite: false
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        align: 'right',
                        verticalAlign: 'top',
                        symbolHeight: 10,
                        symbolWidth: 0,
                        useHTML: true
                    },
                    tooltip: {
                        enabled: true,
                        shadow: false,
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                        useHTML: true,
                        style: {
                            fontFamily: 'gotham'
                        }
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                enabled: false
                            },
                            lineWidth: 2
                        }
                    }
                },
                chartType: 'stockchart',
                title: {
                    text: 'Total Revenue',
                    align: 'left',
                    style: {
                        fontFamily: 'gotham'
                    }
                },
                series: [{}]
            };
        };

        this.getConversionChartConfig = function(data) {
            return {
                options: {
                    xAxis: {
                        tickmarkPlacement: 'on',
                        type: 'datetime',
                        tickInterval: 24 * 3600 * 1000,
                        labels: {
                            formatter: function() {
                                return moment(this.value).format("MM/DD");
                            },
                            style: {
                                fontFamily: 'gotham'
                            }
                        }
                    },
                    yAxis: {
                        allowDecimals: false,
                        title: {
                            text: ''
                        },
                        labels: {
                            style: {
                                fontFamily: 'gotham'
                            }
                        },
                        opposite: false
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        align: 'right',
                        verticalAlign: 'top',
                        symbolHeight: 10,
                        symbolWidth: 0,
                        useHTML: true
                    },
                    tooltip: {
                        enabled: true,
                        shadow: false,
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                        useHTML: true,
                        style: {
                            fontFamily: 'gotham'
                        }
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                enabled: false
                            },
                            lineWidth: 2
                        }
                    }
                },
                chartType: 'stockchart',
                title: {
                    text: 'Conversion',
                    align: 'left',
                    style: {
                        fontFamily: 'gotham'
                    }
                },
                series: [{}]
            };
        };

        this.getDaytimesSalesChartConfig = function(data) {
            return {
                options: {
                    xAxis: {
                        tickmarkPlacement: 'on',
                        type: 'datetime',
                        tickInterval: 24 * 3600 * 1000,
                        labels: {
                            formatter: function() {
                                return moment(this.value).format("MM/DD");
                            },
                            style: {
                                fontFamily: 'gotham'
                            }
                        }
                    },
                    yAxis: {
                        allowDecimals: false,
                        title: {
                            text: ''
                        },
                        labels: {
                            style: {
                                fontFamily: 'gotham'
                            }
                        },
                        opposite: false
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        align: 'right',
                        verticalAlign: 'top',
                        symbolHeight: 10,
                        symbolWidth: 0,
                        useHTML: true
                    },
                    tooltip: {
                        enabled: true,
                        shadow: false,
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                        useHTML: true,
                        style: {
                            fontFamily: 'gotham'
                        }
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                enabled: false
                            },
                            lineWidth: 2
                        }
                    }
                },
                chartType: 'stockchart',
                title: {
                    text: 'Daytimes Sale',
                    align: 'left',
                    style: {
                        fontFamily: 'gotham'
                    }
                },
                series: [{}]
            };
        };

        this.getDaytimesTransactionsChartConfig = function(data) {
            return {
                options: {
                    xAxis: {
                        tickmarkPlacement: 'on',
                        type: 'datetime',
                        tickInterval: 24 * 3600 * 1000,
                        labels: {
                            formatter: function() {
                                return moment(this.value).format("MM/DD");
                            },
                            style: {
                                fontFamily: 'gotham'
                            }
                        }
                    },
                    yAxis: {
                        allowDecimals: false,
                        title: {
                            text: ''
                        },
                        labels: {
                            style: {
                                fontFamily: 'gotham'
                            }
                        },
                        opposite: false
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        align: 'right',
                        verticalAlign: 'top',
                        symbolHeight: 10,
                        symbolWidth: 0,
                        useHTML: true
                    },
                    tooltip: {
                        enabled: true,
                        shadow: false,
                        backgroundColor: 'transparent',
                        borderWidth: 0,
                        useHTML: true,
                        style: {
                            fontFamily: 'gotham'
                        }
                    },
                    plotOptions: {
                        series: {
                            marker: {
                                enabled: false
                            },
                            lineWidth: 2
                        }
                    }
                },
                chartType: 'stockchart',
                title: {
                    text: 'Daytimes Transaction',
                    align: 'left',
                    style: {
                        fontFamily: 'gotham'
                    }
                },
                series: [{}]
            };
        };

        // var genderPie = {
        //     id: 'genderPie',
        //     title: {
        //         text: 'GENDER',
        //     },
        //     series: [{
        //         name: 'Percent',
        //         data: data
        //     }],
        //     credits: {
        //         enabled: false
        //     },
        //     image: '/wp-content/themes/kaching3/assets/images/analytics/pieImages/female_icon.svg',
        //     max: 'Female'
        // };
        this.getGenderConfig = function(data) {
            return {
                options: {
                    chart: {
                        marginTop: -90,
                        height: 200
                    },
                    title: {
                        text: 'GENDER', //'Browser<br>shares<br>2015',
                        align: 'center', //'center',
                        verticalAlign: 'bottom', //'bottom',
                        y: -5 //40
                    },
                    tooltip: {
                        borderWidth: 0,
                        shadow: false,
                        useHTML: true,
                        formatter: function() {
                            return(
                                `<div class="highcharts-tool-tip-custom">
                                    <span>${this.key}: ${this.point.percentage}%</span>
                                </div>`);
                        }
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: false, //true,
                                distance: -50, //-50,
                                style: {
                                    fontWeight: 'bold', //'bold',
                                    color: 'white'
                                }
                            },
                            startAngle: 0, //0,
                            endAngle: 360, //360,
                            center: ['50%', '65%'],
                            showInLegend: true,
                            size: '50%'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    }
                },

                series: [{
                    type: 'pie',
                    name: 'Percent', //'Browser share',
                    innerSize: '70%'
                }]
            };
        };

        this.getAgeConfig = function(data) {
            return {
                options: {
                    chart: {
                        marginTop: -90,
                        height: 200
                    },
                    title: {
                        text: 'AGE', //'Browser<br>shares<br>2015',
                        align: 'center', //'center',
                        verticalAlign: 'bottom', //'bottom',
                        y: -5 //40
                    },

                    tooltip: {
                        borderWidth: 0,
                        shadow: false,
                        useHTML: true,
                        formatter: function() {
                            return(
                                `<div class="highcharts-tool-tip-custom">
                                    <span>${this.key}: ${this.point.percentage}%</span>
                                </div>`);
                        }
                    },

                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: false, //true,
                                distance: -50, //-50,
                                style: {
                                    fontWeight: 'bold', //'bold',
                                    color: 'white'
                                }
                            },
                            startAngle: 0, //0,
                            endAngle: 360, //360,
                            center: ['50%', '65%'],
                            showInLegend: true,
                            size: '50%'
                        }

                    },
                    legend: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    }
                },

                series: [{
                    type: 'pie',
                    name: 'Percent', //'Browser share',
                    innerSize: '70%'
                }],

            };
        };

        this.getCountryConfig = function(data) {
            return {
                options: {
                    chart: {
                        marginTop: -90,
                        height: 200
                    },
                    title: {
                        text: 'COUNTRY', //'Browser<br>shares<br>2015',
                        align: 'center', //'center',
                        verticalAlign: 'bottom', //'bottom',
                        y: -5 //40
                    },
                    tooltip: {
                        borderWidth: 0,
                        shadow: false,
                        useHTML: true,
                        formatter: function() {
                            return(
                                `<div class="highcharts-tool-tip-custom">
                                    <span>${this.key}: ${this.point.percentage}%</span>
                                </div>`);
                        }
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: false, //true,
                                distance: -50, //-50,
                                style: {
                                    fontWeight: 'bold', //'bold',
                                    color: 'white'
                                }
                            },
                            startAngle: 0, //0,
                            endAngle: 360, //360,
                            center: ['50%', '65%'],
                            showInLegend: true,
                            size: '50%'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    }
                },

                series: [{
                    type: 'pie',
                    name: 'Percent', //'Browser share',
                    innerSize: '70%'
                }]
            };
        };

        this.getDeviceConfig = function(data) {
            return {
                options: {
                    chart: {
                        marginTop: -90,
                        height: 200
                    },
                    title: {
                        text: 'DEVICE', //'Browser<br>shares<br>2015',
                        align: 'center', //'center',
                        verticalAlign: 'bottom', //'bottom',
                        y: -5 //40
                    },
                    tooltip: {
                        borderWidth: 0,
                        shadow: false,
                        useHTML: true,
                        formatter: function() {
                            return(
                                `<div class="highcharts-tool-tip-custom">
                                    <span>${this.key}: ${this.point.percentage}%</span>
                                </div>`);
                        }
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: false, //true,
                                distance: -50, //-50,
                                style: {
                                    fontWeight: 'bold', //'bold',
                                    color: 'white'
                                }
                            },
                            startAngle: 0, //0,
                            endAngle: 360, //360,
                            center: ['50%', '65%'],
                            showInLegend: true,
                            size: '50%'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    }
                },

                series: [{
                    type: 'pie',
                    name: 'Percent', //'Browser share',
                    innerSize: '70%'
                }]
            };
        };

        this.getSaleCountryConfig = function(data) {
            return {
                options: {
                    chart: {
                        marginTop: -90,
                        height: 200
                    },
                    title: {
                        text: 'COUNTRY', //'Browser<br>shares<br>2015',
                        align: 'center', //'center',
                        verticalAlign: 'bottom', //'bottom',
                        y: -5 //40
                    },
                    tooltip: {
                        borderWidth: 0,
                        shadow: false,
                        useHTML: true,
                        formatter: function() {
                            return(
                                `<div class="highcharts-tool-tip-custom">
                                    <span>${this.key}: ${this.point.percentage}%</span>
                                </div>`);
                        }
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: false, //true,
                                distance: -50, //-50,
                                style: {
                                    fontWeight: 'bold', //'bold',
                                    color: 'white'
                                }
                            },
                            startAngle: 0, //0,
                            endAngle: 360, //360,
                            center: ['50%', '65%'],
                            showInLegend: true,
                            size: '50%'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    }
                },

                series: [{
                    type: 'pie',
                    name: 'Percent', //'Browser share',
                    innerSize: '70%'
                }]
            };
        };

        this.getSaleDeviceConfig = function(data) {
            return {
                options: {
                    chart: {
                        marginTop: -90,
                        height: 200
                    },
                    title: {
                        text: 'DEVICE', //'Browser<br>shares<br>2015',
                        align: 'center', //'center',
                        verticalAlign: 'bottom', //'bottom',
                        y: -5 //40
                    },
                    tooltip: {
                        borderWidth: 0,
                        shadow: false,
                        useHTML: true,
                        formatter: function() {
                            return(
                                `<div class="highcharts-tool-tip-custom">
                                    <span>${this.key}: ${this.point.percentage}%</span>
                                </div>`);
                        }
                    },
                    plotOptions: {
                        pie: {
                            dataLabels: {
                                enabled: false, //true,
                                distance: -50, //-50,
                                style: {
                                    fontWeight: 'bold', //'bold',
                                    color: 'white'
                                }
                            },
                            startAngle: 0, //0,
                            endAngle: 360, //360,
                            center: ['50%', '65%'],
                            showInLegend: true,
                            size: '50%'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    }
                },

                series: [{
                    type: 'pie',
                    name: 'Percent', //'Browser share',
                    innerSize: '70%'
                }]
            };
        };

        return {
            getScansSetting: model.getScansSetting,
            setScansSetting: model.setScansSetting,
            getSalesSetting: model.getSalesSetting,
            setSalesSetting: model.setSalesSetting,
            getBoxChartConfig: model.getBoxChartConfig,
            getActiveUsersConfig: model.getActiveUsersConfig,
            getGenderConfig: model.getGenderConfig,
            getAgeConfig: model.getAgeConfig,
            getCountryConfig: model.getCountryConfig,
            getDeviceConfig: model.getDeviceConfig,
            getSaleCountryConfig: model.getSaleCountryConfig,
            getSaleDeviceConfig: model.getSaleDeviceConfig,
            getTotalRevenueConfig: model.getTotalRevenueConfig,
            getConversionChartConfig: model.getConversionChartConfig,
            getDaytimesSalesChartConfig: model.getDaytimesSalesChartConfig,
            getDaytimesTransactionsChartConfig: model.getDaytimesTransactionsChartConfig
        };
    }]);

})(angular, _);
