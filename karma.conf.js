// Karma configuration
// Generated on Fri Jul 07 2017 16:49:19 GMT+0200 (CEST)

const customLaunchers = {
    // Chrome (Windows)
    win_chrome_latest: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 8',
        version: 'latest'
    },
    win_chrome_latest_1: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 8',
        version: 'latest-1'
    },

    // Firefox (Windows)
    win_firefox_latest: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 10',
        version: 'latest'
    },
    win_firefox_latest_1: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 10',
        version: 'latest-1'
    },

    // Edge
    win_edge_latest: {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        platform: 'Windows 10',
        version: 'latest'
    },
    // Edge "latest-1" is not supported

    // IE 11
    win_ie11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 10',
        version: '11.103'
    },

    // IE 10
    win_ie10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8',
        version: '10.0'
    },

    // Chrome (macOS)
    mac_chrome_latest: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'macOS 10.12',
        version: 'latest'
    },
    mac_chrome_latest_1: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'macOS 10.12',
        version: 'latest-1'
    },

    // Firefox (Windows)
    mac_firefox_latest: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'macOS 10.12',
        version: 'latest'
    },
    mac_firefox_latest_1: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'macOS 10.12',
        version: 'latest-1'
    },

    // Safari
    mac_safari_latest: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'macOS 10.12',
        version: 'latest'
    },
    // Safari "latest-1" is not supported

    // Safari (iOS)
    ios_safari_latest: {
        base: 'SauceLabs',
        browserName: 'Safari',
        appiumVersion: '1.6.5',
        deviceName: 'iPhone Simulator',
        deviceOrientation: 'portrait',
        platformVersion: 'latest',
        platformName: 'iOS',
    },

    // Chrome (Android)
    android_chrome_latest: {
        base: 'SauceLabs',
        browserName: 'Chrome',
        appiumVersion: '1.6.5',
        deviceName: 'Android Emulator',
        deviceOrientation: 'portrait',
        platformVersion: 'latest',
        platformName: 'Android',
    },
};

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['qunit'],


        // list of files / patterns to load in the browser
        files: [
            'tests/dist/complete-library-build.js',
            'tests/dist/all-tests.js'
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        //reporters: ['progress'],
        reporters: ['dots', 'saucelabs'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // browsers: ['Chrome'],
        browsers: Object.keys(customLaunchers),


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        // singleRun: false,
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        // use high timeout to better handle long running iOS tasks
        captureTimeout: 180000,

        sauceLabs: {
            testName: 'mojave',
            connectOptions: {
                verbose: true,
                verboseDebugging: true,
            },
        },
        customLaunchers: customLaunchers,
    });
};
