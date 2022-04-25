const tsNode = require('ts-node');
const path = require('path');
const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));
const supportedBrowsers = require('./supportedBrowsers');

const config = {
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  cucumberOpts: {
    require: [
      './cucumber.conf.js',
      './src/step_definitions/*.ts'
    ],
    compiler: 'ts:ts-node/register',
    tags: ['@crossbrowser'],
    keepAlive: false,
    profile: false,
    'fail-fast': false,
    'no-source': true,
    strict: true,
    format: ['node_modules/cucumber-pretty', 'json:./cb_reports/saucelab_results.json'],
  },

  sauceSeleniumAddress: 'ondemand.eu-central-1.saucelabs.com:443/wd/hub',
  host: 'ondemand.eu-central-1.saucelabs.com',
  sauceRegion: 'eu',
  port: 80,
  processes:23,
  sauceConnect: true,
  // sauceProxy: 'http://proxyout.reform.hmcts.net:8080',  // Proxy for the REST API
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  SAUCE_REST_ENDPOINT: 'https://eu-central-1.saucelabs.com/rest/v1/',

  specs: [
    './src/features/comments.panel.feature',
    './src/features/navigation.feature',
    './src/features/search.feature',
    './src/features/zoom.feature'
  ],

  baseUrl: (process.env.TEST_URL || 'http://localhost:3000/').replace('https', 'http'),
  allScriptsTimeout: 220000,
  useAllAngular2AppRoots: true,
  multiCapabilities: supportedBrowsers.multiCapabilities,
  maxSessions: 7,

  plugins: [
    {
      package: 'protractor-multiple-cucumber-html-reporter-plugin',
      options: {
        automaticallyGenerateReport: true,
        removeExistingJsonReportFile: true,
        reportName: 'Media Viewer CrossBrowser Tests',
        jsonDir: 'reports/tests/crossbrowser',
        reportPath: 'reports/tests/crossbrowser',
        displayDuration: true,
        durationInMS: false
      }
    }
  ],

  onPrepare() {
    const caps = browser.getCapabilities();
    browser.manage()
      .window()
      .maximize();
    browser.waitForAngularEnabled(false);

    tsNode.register({
      project: path.join(__dirname, './tsconfig.e2e.json')
    });
  },

  onComplete() {
    return browser.getProcessedConfig().then(function (c) {
      return browser.getSession().then(function (session) {
        // required to be here so saucelabs picks up reports to put in jenkins
        console.log('SauceOnDemandSessionID=' + session.getId() + ' job-name=mv-xb-tests');
      });
    });
  }
};

exports.config = config;
