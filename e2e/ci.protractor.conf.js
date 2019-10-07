// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
const reporter = require('cucumber-html-reporter');
const path = require('path');

exports.config = {
  SELENIUM_PROMISE_MANAGER: false,
  allScriptsTimeout: 120000,
  getPageTimeout: 120000,
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  capabilities: {
    browserName: 'firefox',
    firefoxOptions: {
      args: ['--headless']
    },
    'moz:firefoxOptions': {
      args: ['--headless']
    }
  },
  chromeDriver: '../node_modules/webdriver-manager/selenium/chromedriver_77.0.3865.40',
  geckoDriver: '../node_modules/webdriver-manager/selenium/geckodriver-v0.25.0',
  directConnect: true,
  baseUrl: 'http://localhost:3000/',
  specs: [
    './src/**/*.feature',
  ],
  onPrepare: function () {
    require('ts-node').register({
      project: path.join(__dirname, './tsconfig.e2e.json')
    });
  },
  onComplete: () => {
    const options = {
      theme: 'bootstrap',
      jsonFile: './cucumber.json',
      output: './reports/cucumber/cucumber.html',
      reportSuiteAsScenarios: true,
      launchReport: false,
      metadata: {
        'App Name': 'Media Viewer'
      }
    };
    reporter.generate(options);
  },
  cucumberOpts: {
    compiler: 'ts:ts-node/register',
    strict: true,
    plugin: ['pretty'],
    format: 'json:./cucumber.json',
    require: ['../e2e/src/step_definitions/*.ts'],
    tags: "@MediaViewer",
  },
  noGlobals: true

};

