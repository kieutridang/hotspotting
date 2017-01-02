(function (angular) {
	"use strict";

	try {
		angular.module('templates');
	} catch (e) {
		angular.module('templates', []);
	}

	var app = angular.module('app', [
		'constants',
		'templates',
		'ui.router',
		'ngCookies',
		'ui.router',
		'ui.bootstrap',
		'ngSanitize',
		'services',
		'filters',
		'directives',
		'models',
		'controllers',
		'campaignModule',
		'dashboardModule',
		'productModule',
		'postMessage',
		'restangular',
		'vcRecaptcha',
		'ngHelperDynamicTemplateLoader',
		'daterangepicker',
		'feedModule',
		'ui.map',
		'highcharts-ng',
		'ngDragDrop',
		'ngCsv',
		'LocalStorageModule',
		'madvas.angular-globe',
        'pascalprecht.translate',// angular-translate
        'tmh.dynamicLocale'// angular-dynamic-locale
    ]);

  /* Setup global settings */
  app.factory('settings', function($rootScope,appConfig) {
    // supported languages
    var settings = {
      appName : appConfig.appName,
      layout: {
        pageSidebarClosed: false, // sidebar menu state
        pageContentWhite: true, // set page content layout
        pageBodySolid: false, // solid body color state
        pageAutoScrollOnLoad: 1000, // auto scroll to top on page load
        isHidePageHeader : false,
        bodyLayout: ''
      },
      assetsPath: 'assets',
      globalPath: 'assets/global',
      layoutPath: 'assets/layouts/layout',
    };

    $rootScope.settings = settings;

    return settings;
  });

	app.config(function config($urlRouterProvider, $stateProvider, $locationProvider, $httpProvider, $dynamicTemplateLoaderProvider, highchartsNGProvider, appConfig, localStorageServiceProvider, $translateProvider) {
		$locationProvider.html5Mode({
			enabled: false,
			requireBase: false
		});

		// Register the HTTP interceptors
		if (appConfig.debug) {
			$dynamicTemplateLoaderProvider.registerInterceptors();
		}

		localStorageServiceProvider.setPrefix('app').setStorageType('localStorage').setNotify(true, true);


		$httpProvider.interceptors.push('bearerTokenInterceptor');

		// highchartsNGProvider.lazyLoad([highchartsNGProvider.HIGHCHART/HIGHSTOCK, "maps/modules/map.js", "mapdata/custom/world.js"]);// you may add any additional modules and they will be loaded in the same sequence

	    highchartsNGProvider.basePath("/js/"); // change base path for scripts, default is http(s)://code.highcharts.com/

        // Translation configuration
        $translateProvider.useMissingTranslationHandlerLog();
        $translateProvider.useStaticFilesLoader({
            prefix: 'content/locales/locale-',// path to translations files
            suffix: '.json'// suffix, currently- extension of the translations
        });
        $translateProvider.preferredLanguage('en');// is applied on first load
	});

  app.run(function run($rootScope, $state, $stateParams, settings, $http, $window, $timeout, appConfig, Restangular, AuthService, $translate) {
      /* Init global settings and run the app */
      $rootScope.$state = $state; // state to be accessed from view
      $rootScope.$settings = settings; // state to be accessed from view
      $rootScope.$stateParams = $stateParams;

      Restangular.setBaseUrl(appConfig.apiUrl);
      AuthService.init();

      var loginState = 'login.signIn';
      $rootScope.$on('$stateChangeStart', function (e, to) {
          if (to.authenticate && !$rootScope.globals.isAuthenticated) {
              e.preventDefault();
              $state.go(loginState);
          }
      });

      window.processSocialLogin = function (data) {
          data.rememberMe = !!appConfig.rememberMe;
          $rootScope.$emit(loginState, data);
      };

      function listenMessage(event) {
          if (!(event.data.name === 'readyForGlobe' || event.data.name === 'click')) {
              try {
                  window.processSocialLogin(JSON.parse(event.data))
              } catch (e) {
                  console.log('Cannot parse JSON data: ' + e.message);
              }
          }

      }

      if (window.addEventListener) {
          window.addEventListener("message", listenMessage, false);
      } else {
          window.attachEvent("onmessage", listenMessage);
      }

      //$rootScope.$on('login', function (event, data) {
      //	AuthService.setCredentials(data, data.rememberMe);
      //	$state.go('testSuite.allProjects', {}, { reload: true });
      //	$rootScope.globals.isHideHeaderToolbar = false;
      //});

      $rootScope.$on('logOut', function () {
          AuthService.clearCredentials();
          $state.go(loginState);
      });
	});
})(angular);
