/* Setup Rounting For All Pages */
(function (angular, _, undefined) {
    'use strict';

    var app = angular.module('app');

    app.config(['$stateProvider', '$urlRouterProvider', function config($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/");
        //$urlRouterProvider.otherwise("/dashboard");

        //#region Login
        $stateProvider.state('login', {
            abstract: true,
            url: "/login",
            templateUrl: "views/layout/login-layout.html",
            controller: 'AuthController',
            authenticate: false
        });

        $stateProvider.state('login.signIn', {
            url: '',
            data: {pageTitle: 'Sign In'},
            templateUrl: 'views/auth/sign-in.html',
            controller: 'SignInController',
            authenticate: false
        });

        $stateProvider.state('signInAuto', {
            url: '/auto/:hideHeader/:hideLeftBar/:section',
            data: {pageTitle: 'Sign In'},
            controller: 'SignInControllerAuto',
            authenticate: false
        });

        $stateProvider.state('signInAutoLocale', {
            url: '/auto/:hideHeader/:hideLeftBar/:section/:locale',
            data: {pageTitle: 'Sign In'},
            controller: 'SignInControllerAuto',
            authenticate: false
        });

        $stateProvider.state('login.signUp', {
            url: "/sign-up",
            data: {pageTitle: 'Sign Up'},
            templateUrl: 'views/auth/sign-up.html',
            controller: 'SignUpController',
            authenticate: false
        });
        //#endregion

        //#region Home
        $stateProvider.state('home', {
            abstract: true,
            url: "/",
            templateUrl: "views/layout/dashboard-layout.html",
            authenticate: true
        });

        $stateProvider.state('home.main', {
            url: "",
            controller: function ($state) {
                $state.go('home.dashboard');
            },
            authenticate: true
        });


        $stateProvider.state('home.dashboard', {
            url: "dashboard",
            data: {pageTitle: 'Dashboard'},
            templateUrl: "views/dashboard/dashboard.html",
            controller: 'DashboardController',
            authenticate: true
        });

        $stateProvider.state('home.products', {
            url: "products",
            data: {pageTitle: 'Products'},
            controller: 'ProductController',
            templateUrl: 'views/products/products.html',
            authenticate: true
        });

        $stateProvider.state('home.featured', {
            url: "featured",
            data: {pageTitle: 'Featured'},
            controller: 'FeaturedController',
            templateUrl: 'views/featured/featured.html',
            authenticate: true
        });

        $stateProvider.state('home.orderHistory', {
            url: "order-history",
            data: {pageTitle: 'Order-history'},
            controller: 'OrderController',
            templateUrl: 'views/order-history/order-history.html',
            authenticate: true
        });
        $stateProvider.state('home.orderDetails', {
            url: "order-history/order-details",
            data: {pageTitle: 'Order-details'},
            controller: 'OrderDetailsController',
            templateUrl: 'views/order-history/order-details.html',
            authenticate: true
        });

        //#region Accounts
        $stateProvider.state('home.accounts', {
            url: "manage-accounts",
            data: {pageTitle: 'Account'},
            controller: 'BrandController',
            // templateUrl: 'views/manage-accounts/brands.html',
            authenticate: true
        });

        $stateProvider.state('home.brandDetails', {
            url: 'brands/:brandId',
            data: {pageTitle: 'Brand'},
            controller: 'BrandDetailsController',
            templateUrl: 'views/brands/details.html',
            authenticate: true
        });

        $stateProvider.state('home.brandDetails.addImageCampaign', {
            url: '/campaigns/add-image',
            data: {pageTitle: 'Image'},
            templateUrl: 'views/campaigns/add-image.html',
            controller: 'AddImageCampaignController',
            authenticate: true
        });

        $stateProvider.state('home.brandDetails.addVideoCampaign', {
            url: '/campaigns/add-video',
            data: {pageTitle: 'Video'},
            templateUrl: 'views/campaigns/add-video.html',
            controller: 'AddVideoCampaignController',
            authenticate: true
        });

        $stateProvider.state('home.brandDetails.editVideoCampaign', {
            url: '/campaigns/videos/:id',
            data: {pageTitle: 'Video'},
            templateUrl: 'views/campaigns/edit-video.html',
            controller: 'EditVideoCampaignController',
            authenticate: true
        });

        $stateProvider.state('home.brandDetails.addMediaCampaign', {
            url: '/campaigns/add-media',
            data: {pageTitle: 'Media'},
            templateUrl: 'views/campaigns/add-media-file.html',
            controller: 'AddMediaCampaignController',
            authenticate: true
        });

        $stateProvider.state('home.brandDetails.editMediaCampaign', {
            url: '/campaigns/media/:id',
            data: {pageTitle: 'Media'},
            templateUrl: 'views/campaigns/edit-media-file.html',
            controller: 'EditMediaCampaignController',
            authenticate: true
        });
        //#endregion

        $stateProvider.state('home.analytics', {
            url: "analytics",
            data: {pageTitle: 'Analytics'},
            templateUrl: 'views/analytics/analytics.html',
            controller: 'AnalyticsController',
            authenticate: true
        });
        $stateProvider.state('home.notification', {
            url: "notification",
            data: {pageTitle: 'Notification'},
            templateUrl: 'views/notify/notification.html',
            controller: 'NotificationController',
            authenticate: true
        });
        $stateProvider.state('home.tutorials', {
            url: "tutorials",
            data: {pageTitle: 'Tutorials'},
            templateUrl: 'views/tutorials/tutorials.html',
            authenticate: true
        });

        $stateProvider.state('home.faqs', {
            url: "faqs",
            data: {pageTitle: 'Faqs'},
            templateUrl: 'views/faqs/faqs.html',
            controller: 'FAQController',
            authenticate: true
        });


        $stateProvider.state('home.settings', {
            url: 'settings',
            data: {pageTitle: 'Setting'},
            controller: 'SettingsController',
            templateUrl: 'views/settings/settings.html',
            authenticate: true
        });


        //---------------------New template----------------------------------------

        $stateProvider.state('home.brandDetails.campaigns', {
            url: '/campaigns?type',
            params: {'brandName': null},
            reloadOnSearch: false,
            data: {pageTitle: 'Campaigns'},
            controller: 'CampaignsController',
            templateUrl: 'views/campaigns/index-2.html',
            authenticate: true
        });

        $stateProvider.state('home.brandDetails.createCampaignSetTrigger', {
            url: '/create-campaign-set-trigger',
            params: {'brandName': null},
            reloadOnSearch: false,
            data: {pageTitle: 'Trigger'},
            controller: 'createCampaignSetTrigger',
            templateUrl: 'views/campaigns/create-campaign-edit-image.html',
            authenticate: true
        });

        $stateProvider.state('home.brandDetails.createCampaignImageLinkProduct', {
            url: '/create-campaign-link-product',
            params: {'brandName': null},
            reloadOnSearch: false,
            data: {pageTitle: 'Product'},
            controller: 'createCampaignImageLinkProduct',
            templateUrl: 'views/campaigns/image-link-products.html',
            authenticate: true
        });

        $stateProvider.state('home.brandDetails.createCampaignDetails', {
            url: '/create-campaign-details',
            params: {'brandName': null},
            data: {pageTitle: 'Campaigns'},
            reloadOnSearch: false,
            controller: 'createCampaignDetails',
            templateUrl: 'views/campaigns/campaign-details.html',
            authenticate: true
        });

        $stateProvider.state('home.brandDetails.editCampaignMagazine', {
            url: '/campaigns/media/:id',
            data: {pageTitle: 'Magazine'},
            templateUrl: 'views/campaigns/edit-campaign-magazine.html',
            controller: 'editCampaignMagazine',
            authenticate: true
        });

        $stateProvider.state('home.brandDetails.editCampaignVideo', {
            url: '/campaigns/video/:id',
            data: {pageTitle: 'Video'},
            templateUrl: 'views/campaigns/edit-campaign-video.html',
            controller: 'editCampaignVideo',
            authenticate: true
        });

        $stateProvider.state('home.brandDetails.recipe', {
            url: '/campaigns/recipe/:id',
            data: {pageTitle: 'Recipe'},
            templateUrl: 'views/campaigns/add-recipe.html',
            controller: 'recipeController',
            authenticate: true
        });

        $stateProvider.state('home.feeds', {
            url: 'feeds',
            reloadOnSearch: false,
            controller: 'ListFeedsController',
            templateUrl: 'views/feeds/feed.html',
            authenticate: true
        });

    }]);


})(angular, _);
