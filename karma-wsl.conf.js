// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const originalConfig = require('./karma.conf');

process.env.CHROME_BIN = '/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe';

module.exports = function (config) {
  originalConfig(config);
};
