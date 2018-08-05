/* eslint-disable camelcase */

// Karma configuration

const browsers = {
    // Chrome (Windows)
    win_chrome_latest: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 8',
        version: 'latest',
    },
    win_chrome_latest_1: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'Windows 8',
        version: 'latest-1',
    },

    // Firefox (Windows)
    win_firefox_latest: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 10',
        version: 'latest',
    },
    win_firefox_latest_1: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'Windows 10',
        version: 'latest-1',
    },

    // Edge
    win_edge_latest: {
        base: 'SauceLabs',
        browserName: 'MicrosoftEdge',
        platform: 'Windows 10',
        version: 'latest',
    },
    // Edge "latest-1" is not supported

    // IE 11
    win_ie11: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 10',
        version: '11.103',
    },

    // IE 10
    win_ie10: {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8',
        version: '10.0',
    },

    // Chrome (macOS)
    mac_chrome_latest: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'macOS 10.12',
        version: 'latest',
    },
    mac_chrome_latest_1: {
        base: 'SauceLabs',
        browserName: 'chrome',
        platform: 'macOS 10.12',
        version: 'latest-1',
    },

    // Firefox (Windows)
    mac_firefox_latest: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'macOS 10.12',
        version: 'latest',
    },
    mac_firefox_latest_1: {
        base: 'SauceLabs',
        browserName: 'firefox',
        platform: 'macOS 10.12',
        version: 'latest-1',
    },

    // Safari
    mac_safari_latest: {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'macOS 10.12',
        // "latest" randomly fails on some tests
        version: '10.0',
    },
    // Safari "latest-1" is not supported

    // Safari (iOS)
    ios_safari_latest: {
        base: 'SauceLabs',
        browserName: 'Safari',
        appiumVersion: '1.6.4',
        deviceName: 'iPhone 7 Plus Simulator',
        deviceOrientation: 'portrait',
        // "latest" randomly fails on some tests
        platformVersion: '10.3',
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
        frameworks: ['qunit'],
        files: [
            'tests/dist/complete-library-build.js',
            'tests/dist/all-tests.js',
        ],
        preprocessors: {},
        reporters: ['dots', 'saucelabs'],
        port: 9876,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        // use high timeout to better handle long running iOS tasks
        captureTimeout: 180000,

        // SauceLabs specific config
        sauceLabs: {
            testName: 'mojave',
            connectOptions: {
                verbose: true,
                verboseDebugging: true,
            },

            recordScreenshots: true,
        },

        // Browser config
        customLaunchers: browsers,
        browsers: Object.keys(browsers),
    });
};
