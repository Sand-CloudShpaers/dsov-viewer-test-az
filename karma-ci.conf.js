// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const path = require('puppeteer').executablePath();
console.log(`chrome path: '${path}'`);
process.env.CHROME_BIN = path;

module.exports = function (config) {
  config.set({
    basePath: 'src/app',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-junit-reporter'),
      require('karma-chrome-launcher'),
      require('@angular-devkit/build-angular/plugins/karma'),
      'karma-spec-reporter',
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      jasmine: {
        random: false,
      },
    },
    coverageReporter: {
      dir: require('path').join(__dirname, 'coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true,
      exclude: ['/src/*.ts'],
    },
    junitReporter: {
      outputDir: require('path').join(__dirname, 'reports'),
      outputFile: 'test-results.xml',
    },
    angularCli: {
      environment: 'dev',
    },
    reporters: ['progress', 'kjhtml', 'junit', 'spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: false,
    browsers: ['ChromeHeadlessNoSandbox'],
    singleRun: true,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 50000,
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-features=VizDisplayCompositor'],
      },
    },
  });
  process.on('infrastructure_error', error => {
    console.error('infrastructure_error', error);
  });
};
