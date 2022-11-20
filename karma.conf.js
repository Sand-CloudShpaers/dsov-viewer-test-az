// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
  config.set({
    basePath: 'src/app',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-chrome-launcher'),
      require('karma-sabarivka-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
      'karma-spec-reporter',
    ],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      include: [
        // Specify include pattern(s) first
        'src/**/*.(ts|js)',
        // Then specify "do not include" patterns (note `!` sign on the beginning of each statement)
        '!src/main.(ts|js)',
        '!src/**/*.spec.(ts|js)',
        '!src/**/*.module.(ts|js)',
        '!src/**/environment*.(ts|js)',
        '!src/**/model/**/*',
      ],
      dir: require('path').join(__dirname, 'coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true,
      exclude: ['src/*.ts', '/**/*mock*.ts'],
    },
    angularCli: {
      environment: 'dev',
    },
    reporters: ['progress', 'kjhtml', 'sabarivka', 'spec', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: true,
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
    preprocessors: { '**/*.js': ['coverage'] },
  });
};
