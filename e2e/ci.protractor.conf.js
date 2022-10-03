// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
const path = require('path');

exports.config = {
  SELENIUM_PROMISE_MANAGER: false,
  allScriptsTimeout: 120000,
  getPageTimeout: 120000,
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless', '--window-size=1920,1080']
    }
  },
  directConnect: true,
  baseUrl: "http://em-showcase-aat.service.core-compute-aat.internal/media-viewer",
  // Change baseUrl to the following line to run functional tests locally:
  //baseUrl: "http://localhost:3000/",
  specs: [
    './src/**/*.feature',
  ],
  onPrepare: function () {
    require('ts-node').register({
      project: path.join(__dirname, './tsconfig.e2e.json')
    });
  },
  cucumberOpts: {
    compiler: 'ts:ts-node/register',
    strict: true,
    plugin: ['pretty'],
    format: ['node_modules/cucumber-pretty', 'json:./functional-output/reports/cucumber.json'],
    require: ['../e2e/src/step_definitions/*.ts'],
    tags: "@ci",
  },
  plugins: [
    {
      package: 'protractor-multiple-cucumber-html-reporter-plugin',
      options: {
        automaticallyGenerateReport: true,
        removeExistingJsonReportFile: true,
        reportName: 'MediaViewer Functional Tests',
        jsonDir: './functional-output/reports',
        reportPath: './functional-output/reports/html'
      }
    }
  ]
};

