exports.config = {
  SELENIUM_PROMISE_MANAGER: false,
  allScriptsTimeout: 120000,
  getPageTimeout: 120000,
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      // 'args': ['--no-sandbox', '--start-maximized', 'use-fake-ui-for-media-stream'],
      args: ['--headless', '--window-size=1920,1080']
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:1337',
  specs: [
    './src/**/*.feature',
  ],
  onPrepare: function () {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
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
