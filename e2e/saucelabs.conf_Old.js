const minimist = require('minimist');
const argv = minimist(process.argv.slice(2));

const config = {
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  sauceSeleniumAddress: 'ondemand.eu-central-1.saucelabs.com:443/wd/hub',

  tags: ['MediaViewer'],

  windowSize: '1920x1080',

  chromeOptions: {
    args: ['--headless', '--window-size=1920,1080']
  },

  host: 'ondemand.eu-central-1.saucelabs.com',
  sauceRegion: 'eu',
  port: 80,
  sauceConnect: true,
  specs: [
    // './src/features/bookmarks.feature',
    './src/features/comments.panel.feature',
    './src/features/navigation.feature',
    './src/features/search.feature',
    './src/features/zoom.feature'
  ],

  baseUrl: (process.env.TEST_URL || 'http://localhost:3000/').replace('https', 'http'),

  params: {
    serverUrls: process.env.TEST_URL || 'http://localhost:3000/',
    targetEnv: argv.env || 'local',
    //username: process.env.TEST_EMAIL,
    //password: process.env.TEST_PASSWORD,
  },


  // sauceProxy: 'http://proxyout.reform.hmcts.net:8080',  // Proxy for the REST API
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,
  SAUCE_REST_ENDPOINT: 'https://eu-central-1.saucelabs.com/rest/v1/',
  allScriptsTimeout: 111000,
  maxSessions: 20,


  useAllAngular2AppRoots: true,
  multiCapabilities: [
    {
      browserName: 'chrome',
      version: 'latest',
      platform: 'macOS 10.15',
      screenResolution: '1600x1200',
      name: 'Media Viewer: macOS-latest-chrome-tests',
      tunnelIdentifier: 'reformtunnel',
      extendedDebugging: true,
      capturePerformance: true,
      maxInstances: 1,
      shardTestFiles: true,
    },
    {
      browserName: 'firefox',
      version: 'latest',
      platform: 'Windows 10',
      screenResolution: '1600x1200',
      name: 'Media Viewer: windows-latest-firefox-tests',
      tunnelIdentifier: 'reformtunnel',
      extendedDebugging: true,
      capturePerformance: true,
      maxInstances: 1,
      shardTestFiles: true,
    },
    // The following is used to run the crossbrowser tests locally:
    // {
    //   browserName: 'chrome',
    //   platform: 'macOS 10.15',
    //   version: 'latest',
    //   screenResolution: '1600x1200',
    //   name: 'Media Viewer: macOS-latest-chrome-tests',
    //   tunnelIdentifier: 'MediaViewer',
    //   extendedDebugging: true,
    //   capturePerformance: true,
    //   sharedTestFiles: false,
    //   maxInstances: 1
    // },
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
    format: ['node_modules/cucumber-pretty', 'json:cb_reports/saucelab_results.json'],
    require: ['../e2e/src/step_definitions/*.ts'],
    tags: ['@crossbrowser'],
  },
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
  ]
};

exports.config = config;