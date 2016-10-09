// Karma configuration
// Generated on Thu Sep 08 2016 15:00:17 GMT-0300 (BRT)

module.exports = function(config) {
  const pkg = require('../package.json');

  const merge = (...sources) => sources.reduce((r, x) => {
    Object.keys(x).forEach(k => {
      r[k] = x[k];
    });
    return r;
  }, {});

  const browser = (platform, name, versions) => merge(...versions.map(v => ({
    [`sl_${name}_${v}`]: {
      base: 'SauceLabs',
      browserName: name,
      platform: platform,
      version: v
    }
  })));

  const mobile = (platform, browser, versions, options) => merge(...versions.map(v => ({
    [`sl_mob_${platform}_${v}`]: merge({
      base: 'SauceLabs',
      browserName: browser,
      appiumVersion: '1.5.3',
      platformName: platform,
      platformVersion: v,
      deviceOrientation: 'portrait'
    }, options)
  })));

  const customLaunchers = merge(
    // Desktop browsers
    browser('Linux', 'chrome', [36, 42, 48]),
    browser('Linux', 'firefox', [21, 33, 45]),
    browser('OS X 10.8', 'safari', [6]),
    browser('OS X 10.9', 'safari', [7]),
    browser('OS X 10.10', 'safari', [8]),
    browser('OS X 10.11', 'safari', [9]),
    browser('Windows 7', 'opera', [12.12]),
    browser('Windows 7', 'internet explorer', [9, 10, 11]),
    browser('Windows 10', 'MicrosoftEdge', [13]),

    // Mobile browsers
    mobile('Android', 'Browser', [4.4, 5, 5.1], {
      deviceName: 'Android Emulator',
      deviceType: 'phone',
      deviceOrientation: 'portrait'
    }),

    mobile('iOS', 'Safari', [7, 8.1, 9.3], {
      deviceOrientation: 'portrait',
      deviceName: 'iPhone Simulator'
    })
  );

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],


    // list of files / patterns to load in the browser
    files: [
      'browser/tests.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    sauceLabs: {
        testName: `Folktale v${pkg.version}`
    },
    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    reporters: ['dots', 'saucelabs'],
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: 1,

    browserDiconnectTimeout: 60000,
    browserNoActivityTimeout: 180000
  });
}
