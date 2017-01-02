module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var path = require('path');
    var _ = require('lodash');
    var reload = require('require-reload')(require);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        setting: {
            // configurable paths
            app: '.',
            dist: 'www',
            assets: 'assets2'
        },
        'sass': {
            dev: {
                files: [{
                    expand: true,
                    src: ['*.scss'],
                    cwd: 'content/css/scss',
                    dest: 'content/css',
                    ext: '.css'
                }]
            }
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            css: {
                files: 'content/css/scss/*.scss',
                tasks: ['newer:sass:dev'],
                //tasks: ['sass:dev'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            js: {
                files: ['<%= setting.app %>/app/**/*.js'],
                //tasks: ['newer:jshint:all'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            html: {
                files: 'views/**/*.html',
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            configEnvironment: {
                files: 'config/environment/*.js',
                tasks: ['ngconstant:dev'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            includeSourceJs: {
                // Watch for added and deleted scripts to update index.html
                files: 'app/**/*.js',
                tasks: ['asset-linker:devJs'],
                options: {
                    event: ['added', 'deleted'],
                    spawn: false,
                    livereload: true
                }
            },
            includeSourceCssAdded: {
                // Watch for added and deleted scripts to update index.html
                files: 'content/css/scss/*.scss',
                tasks: ['newer:sass:dev' /*, 'newer:autoprefixer'*/, 'asset-linker:devCss'],
                options: {
                    event: ['added'],
                    spawn: false,
                    livereload: true
                }
            },
            includeSourceCssDeleted: {
                // Watch for added and deleted scripts to update index.html
                files: 'content/css/scss/*.scss',
                tasks: ['clean:css', 'sass:dev', /* 'autoprefixer',*/ 'asset-linker:devCss'],
                options: {
                    event: ['deleted'],
                    spawn: false,
                    livereload: true
                }
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 3200,
                open: true,
                hostname: 'localhost',
                livereload: false,
                maxAge: 0
            },
            livereload: {
                options: {
                    open: true,
                    base: '<%= setting.app %>'
                }
            },
            dist: {
                options: {
                    port: 3201,
                    open: true,
                    base: '<%= setting.dist %>'
                }
            },
            dev: {
                options: {
                    port: 3202,
                    open: true,
                    base: '<%= setting.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    angular: true,
                    _: true,
                    momment: true
                },
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                '<%= setting.app %>/app/**/*.js'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            assets: {
                options: {force: true},
                src: ['<%= setting.assets %>'],
            },
            dist: {
                options: {force: true},
                files: [{
                    dot: true,
                    src: [
                        '.tmp/*',
                        '<%= setting.dist %>/*',
                    ]
                }]
            },
            server: {
                options: {force: true},
                src: ['.tmp/*'],
            },

            css: {
                options: {force: true},
                src: ['content/css/*.{css,map}'],
            },
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['> 1%']
                //browsers: ['last 2 versions', 'ie 8', 'ie 9']
                //browserslist('last 1 version, > 10%')
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'content/css/',
                    src: '*.css',
                    dest: 'content/css/',
                }]
            }
        },
        imagemin: {
            // we don't optimize PNG files as it doesn't work on Linux. If you are not on Linux, feel free to use '**/*.{png,jpg,jpeg}'
            png: {
                options: {
                    optimizationLevel: 7
                },
                files: [{
                    expand: true,
                    src: ['**/*.png'],
                    dest: '<%= setting.dist %>/content',
                    cwd: '<%= setting.dist %>/content',
                }]
            },
            jpg: {
                options: {
                    progressive: false,
                    interlaced: false,
                    //use: [mozjpeg()]
                },
                files: [{
                    expand: true,
                    src: ['**/*.{jpg,jpeg,gif}'],
                    dest: '<%= setting.dist %>/content',
                    cwd: '<%= setting.dist %>/content',
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    src: '{,*/}*.svg',
                    dest: '<%= setting.dist %>/content',
                    cwd: '<%= setting.dist %>/content',
                }]
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= setting.app %>',
                    dest: '<%= setting.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        '*.html',
                        //'views/**/*.html',
                        //'content/css/**/*.*',
                        'content/favicon/**/*.*',
                        'content/fonts/**/*.*',
                        'content/images/**/*.*',
                        'content/locales/**/*.*'
                    ]
                },
                    //{ expand: true, cwd: '.tmp/images', dest: '<%= setting.dist %>/images', src: ['generated/*']},
                    {expand: true, src: ['*.*'], dest: '<%= setting.dist %>/content/fonts', cwd: 'content/css/fonts'},
                    {
                        expand: true,
                        src: ['*.*'],
                        dest: '<%= setting.dist %>/content/css/fonts',
                        cwd: 'assets/global/plugins/simple-line-icons/fonts'
                    },
                    {
                        expand: true,
                        src: ['*.*'],
                        dest: '<%= setting.dist %>/content/fonts',
                        cwd: 'content/fonts/bootstrap'
                    },
                    {
                        expand: true,
                        src: ['index.html', 'views/auth/*.html', 'views/home/*.html', 'views/common/*.html', 'views/layout/*.html'],
                        dest: '<%= setting.dist %>'
                    },
                ]
            },
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'sass:dist'
            ],
            dist: [
                'imagemin',
                'svgmin'
            ]
        },

        // Automatically inject Bower components into the app
        bowerInstall: {
            app: {
                src: ['<%= setting.app %>/index.html'],
                ignorePath: '<%= setting.app %>/'
            },
            //sass: {
            //	//src: ['<%= setting.app %>/content/{,*/}*.{scss,sass}'],
            //	src: ['<%= setting.app %>/content/css/scss/*.{scss,sass}'],
            //	ignorePath: '<%= setting.app %>/bower_components/'
            //}
        },
        'asset-linker': {
            devJs: {
                options: {
                    start: '<!--SCRIPTS-->',
                    end: '<!--SCRIPTS END-->',
                    template: '<script src="%s"></script>',
                    root: '../'
                },
                files: {
                    '<%= setting.app %>/index.html': [
                        'app/lib/*.js',
                        'app/lib/infobox/*.js',
                        'app/*.js',
                        'app/constants/**/*.js',
                        'app/states/**/*.js',
                        'app/models/**/*.js',
                        'app/filters/**/*.js',
                        'app/services/**/*.js',
                        'app/controllers/**/*.js',
                        'app/directives/**/*.js'
                    ],
                    '<%= setting.app %>/char_globe.html': [
                        'app/lib/globe/jquery.min.js',
                        'app/lib/globe/three.min.js',
                        'app/lib/globe/tween.min.js',
                        'app/lib/globe/CanvasRenderer.js',
                        'app/lib/globe/Detector.js',
                        'app/lib/globe/Projector.js',
                        'app/lib/globe/extensions.js',
                        'app/lib/globe/html2canvas.js',
                        'app/lib/globe/jquery.nicescroll.js',
                        'app/lib/globe/stats.min.js',
                        'app/lib/globe/globe.js'
                    ]
                }
            },

            devCss: {
                options: {
                    start: '<!--STYLES-->',
                    end: '<!--STYLES END-->',
                    template: '<link rel="stylesheet" href="%s">',
                    root: '../'
                },
                files: {
                    '<%= setting.app %>/index.html': [
                        'content/css/*.css'
                    ]
                }
            },
        },

        // Dynamically generate angular constant `appConfig` from
        ngconstant: {
            options: {
                name: 'constants',
                dest: '<%= setting.app %>/app/constants/app-constant.js',
                deps: [],
                wrap: true,
                sharedConfigPath: '<%= setting.app %>/config/environment/shared',
                devConfigPath: '<%= setting.app %>/config/environment/development',
                devPublicConfigPath: '<%= setting.app %>/config/environment/development-public',
                distConfigPath: '<%= setting.app %>/config/environment/production',
                localApiConfigPath: '<%= setting.app %>/config/environment/local-api',
            },
            dev: {
                constants: function () {
                    var sharedConfig = reload(grunt.config.get('ngconstant.options.sharedConfigPath'));

                    return {
                        appConfig: _.assign(sharedConfig, reload(grunt.config.get('ngconstant.options.devConfigPath')))
                    };
                }
            },
            localApi: {
                constants: function () {
                    var sharedConfig = reload(grunt.config.get('ngconstant.options.sharedConfigPath'));

                    return {
                        appConfig: _.assign(sharedConfig, reload(grunt.config.get('ngconstant.options.localApiConfigPath')))
                    };
                }
            },
            devPublic: {
                constants: function () {
                    var sharedConfig = reload(grunt.config.get('ngconstant.options.sharedConfigPath'));

                    return {
                        appConfig: _.assign(sharedConfig, reload(grunt.config.get('ngconstant.options.devPublicConfigPath')))
                    };
                }
            },
            dist: {
                constants: function () {
                    var sharedConfig = reload(grunt.config.get('ngconstant.options.sharedConfigPath'));

                    return {
                        appConfig: _.assign(sharedConfig, reload(grunt.config.get('ngconstant.options.distConfigPath')))
                    };
                }
            },

        },

        // Add, remove and rebuild angularjs dependency injection annotations
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: [{
                    expand: true,
                    src: ['**/*.js', '!**/*.min.js'],
                    dest: '<%= setting.assets %>/app',
                    cwd: 'app'
                }]
            }
        },
        //this task is for concentrating all html file to just one js file
        'html2js': {
            appTemplate: {
                options: {
                    base: '',
                    // changing the module name here will be set as the angular module name of for the template cache
                    // So in this case, our code will use 'templates-app' as the module name
                    module: 'templates',
                    watch: false,
                    htmlmin: {
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: false,
                        removeComments: true,
                        removeEmptyAttributes: false,
                        removeRedundantAttributes: false,
                        removeScriptTypeAttributes: false,
                        removeStyleLinkTypeAttributes: false
                    }
                },
                files: {
                    '<%= setting.dist %>/content/templates.js': ['views/**/*.html']
                }
            }
        },
        ngtemplates: {
            dist: {
                cwd: 'views',
                src: ['**/*.html'],
                dest: '<%= setting.dist %>/content/templates.js',
                options: {
                    //append : true,
                    module: 'template.app',
                    htmlmin: {
                        // https://github.com/setting/grunt-usemin/issues/44
                        collapseBooleanAttributes: true,
                        collapseWhitespace: true,
                        removeAttributeQuotes: false,
                        removeComments: true,
                        removeEmptyAttributes: false,
                        removeRedundantAttributes: false,
                        removeScriptTypeAttributes: false,
                        removeStyleLinkTypeAttributes: false
                    }
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: false,
                    removeComments: true,
                    removeEmptyAttributes: false,
                    removeRedundantAttributes: false,
                    removeScriptTypeAttributes: false,
                    removeStyleLinkTypeAttributes: false
                },
                files: [{
                    expand: true,
                    cwd: '<%= setting.dist %>',
                    src: ['*.html', 'views/{,*/}*.html'],
                    dest: '<%= setting.dist %>'
                }]
            }
        },

        // Minify files with UglifyJS. http://gruntjs.com/
        uglify: {
            options: {
                mangle: true,
                beautify: false,
                sourceMap: false,
                report: 'gzip',
                ascii_only: true,
                compress: {
                    drop_console: true,
                    sequences: true,  // join consecutive statemets with the “comma operator”
                    properties: true,  // optimize property access: a["foo"] → a.foo
                    dead_code: true,  // discard unreachable code
                    drop_debugger: true,  // discard “debugger” statements
                    unsafe: false, // some unsafe optimizations (see below)
                    conditionals: true,  // optimize if-s and conditional expressions
                    comparisons: true,  // optimize comparisons
                    evaluate: true,  // evaluate constant expressions
                    booleans: true,  // optimize boolean expressions
                    loops: true,  // optimize loops
                    unused: true,  // drop unused variables/functions
                    hoist_funs: true,  // hoist function declarations
                    hoist_vars: false, // hoist variable declarations
                    if_return: true,  // optimize if-s followed by return/continue
                    join_vars: true,  // join var declarations
                    cascade: true,  // try to cascade `right` into `left` in sequences
                    side_effects: true,  // drop side-effect-free statements
                    warnings: true,  // warn about potentially dangerous optimizations/code
                    global_defs: {}     // global definitions
                }
            },
            templates: {
                files: {
                    '<%= setting.dist %>/content/templates.js': ['<%= setting.dist %>/content/templates.js']
                }
            }
        },
        cssmin: {
            options: {
                //shorthandCompacting: false,
                //roundingPrecision: -1,
                keepSpecialComments: 0,
                sourceMap: false,
                report: 'min'
                //sourceMap: true,
                //report: 'gzip'
            },

            //target: {
            //	files: [{
            //		expand: true,
            //		src: ['**/*.css', '!**/*.min.css'],
            //		dest: '<%= setting.assets %>/content',
            //		cwd: '<%= setting.assets %>/content',
            //	}]
            //}
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= setting.dist %>/*.html'],
            css: ['<%= setting.dist %>/content/css/*.css'],
            js: ['<%= setting.dist %>/content/{,*/}*.js'],
            options: {
                assetsDirs: [
                    '<%= setting.dist %>',
                    '<%= setting.dist %>/content'
                ],
                // This is so we update image references in our ng-templates
                patterns: {
                    js: [
                        [/(content\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
                    ],
                    css: [
                        [/(\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
                    ]
                }
            }
        },
        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: ['<%= setting.app %>/index.html', '<%= setting.app %>/char_globe.html'],
            options: {
                dest: '<%= setting.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['uglifyjs', 'concat'],
                            css: ['concat', 'cssmin']
                        },
                        post: {}
                    }
                }
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        'content/css/*.css',
                        //'views/**/*.html'
                        //'app/*.html'
                    ]
                },
                options: {
                    // Change the default port
                    port: 3200,
                    watchTask: true,
                    server: {
                        baseDir: "./"
                    }
                }
            }
        }


    });


    var ngConstantConfig = '';

    var localDevTasks = [
        'clean:css', 'sass:dev',
        'bowerInstall',
        'asset-linker:devJs',
        'asset-linker:devCss',
        //'connect:livereload',
        'browserSync',
        'watch'
    ];

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        if (target === 'dev') {
            //grunt.config.set('cssmin.options.sourceMap', true);
            grunt.config.set('cssmin.options.report', 'gzip');

            grunt.config.set('uglify.options.mangle', false);
            grunt.config.set('uglify.options.beautify', true);
            grunt.config.set('uglify.options.sourceMap', true);

            ngConstantConfig = 'ngconstant:devPublic';
            grunt.config.set('watch.configEnvironment.tasks', [ngConstantConfig]);
            return grunt.task.run(_.flatten([ngConstantConfig, buildTasks, 'connect:dev:keepalive']));
        }

        if (target === 'local-api') {
            ngConstantConfig = 'ngconstant:localApi';
            grunt.config.set('watch.configEnvironment.tasks', [ngConstantConfig]);
            return grunt.task.run(_.flatten([ngConstantConfig, localDevTasks]));
        }

        ngConstantConfig = 'ngconstant:dev';
        grunt.config.set('watch.configEnvironment.tasks', [ngConstantConfig]);

        return grunt.task.run(_.flatten([ngConstantConfig, localDevTasks]));
    });


    var buildTasks = [
        'clean:dist',
        'clean:assets',
        'bowerInstall',
        'clean:css', 'sass:dev', 'autoprefixer',
        'asset-linker:devJs', 'asset-linker:devCss',
        'ngAnnotate',
        'useminPrepare',
        'uglify',
        'concat',
        'cssmin',
        'html2js',
        'uglify:templates',
        'copy:dist',
        //'imagemin',
        //'rev',
        'usemin',
        'htmlmin',
        'clean:assets',
    ];

    grunt.registerTask('build', function (target) {
        if (target === 'dev') {
            return grunt.task.run(_.flatten(['ngconstant:devPublic', buildTasks]));
        }

        return grunt.task.run(_.flatten(['ngconstant:dist', buildTasks]));
    });

    grunt.registerTask('default', [
        'build'
    ]);


};
