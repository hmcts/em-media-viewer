exports.config = {
  SELENIUM_PROMISE_MANAGER: false,
  allScriptsTimeout: 120000,
  getPageTimeout: 120000,
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  capabilities: {
    browserName: 'chrome',
  },
  directConnect: true,
  baseUrl: 'http://localhost:3000/',
  specs: [
    './src/**/*.feature',
  ],
  onPrepare: function () {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
  },
  onComplete: () => {
    const reporter = require('cucumber-html-reporter');

    const options = {
      theme: 'bootstrap',
      jsonFile: './cucumber.json',
      output: './cucumber.html',
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
    require: ['../e2e/src/step-definitions/*.ts']
  },
  noGlobals: true

};
