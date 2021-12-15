const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
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
    './src/features/*.feature'
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


  useAllAngular2AppRoots: true,
  multiCapabilities: [
//    {
//      browserName: 'chrome',
//      version: 'latest',
//      platform: 'Windows 10',
//      name: 'Media Viewer: windows-latest-chrome-tests',
//      tunnelIdentifier: 'reformtunnel',
//      extendedDebugging: true,
//      capturePerformance: true,
//      shardTestFiles: false,
//      maxInstances: 1
//    },
//    {
//      browserName: 'firefox',
//      version: 'latest',
//      platform: 'Windows 10',
//      name: 'Media Viewer: windows-latest-firefox-tests',
//      tunnelIdentifier: 'reformtunnel',
//      extendedDebugging: true,
//      capturePerformance: true,
//      sharedTestFiles: false,
//      maxInstances: 1
//    },
//    {
//      browserName: 'MicrosoftEdge',
//      platform: 'macOS 10.15',
//      version: 'latest',
//      name: 'Media Viewer: macOS-latest-microsoft-edge-tests',
//      tunnelIdentifier: 'reformtunnel',
//      extendedDebugging: true,
//      capturePerformance: true,
//      sharedTestFiles: false,
//      maxInstances: 1
//    },
    {
      seleniumVersion: '3.8.1',
      browserName: 'chrome',
      browserVersion: 'latest',
      platformName: 'macOS 10.13',
      screenResolution: '1280x768',
      name: 'Media Viewer: macOS-latest-chrome-tests',
      tunnelIdentifier: 'reformtunnel',
      extendedDebugging: true,
      capturePerformance: true,
      sharedTestFiles: false,
      maxInstances: 1
    },

    // The following is used to run the crossbrowser tests locally:
    // {
    //   seleniumVersion: '3.8.1',
    //   browserName: 'googlechrome',
    //   browserVersion: 'latest',
    //   platformName: 'macOS 10.13',
    //   screenResolution: '1280x768',
    //   name: 'Media Viewer: macOS-latest-chrome-tests',
    //   tunnelIdentifier: 'MediaViewer',
    //   extendedDebugging: true,
    //   capturePerformance: true,
    //   sharedTestFiles: false,
    //   maxInstances: 1
    // },

//    {
//      browserName: 'firefox',
//      version: 'latest',
//      platform: 'macOS 10.15',
//      name: 'Media Viewer: macOS-latest-firefox-tests',
//      tunnelIdentifier: 'reformtunnel',
//      extendedDebugging: true,
//      capturePerformance: true,
//      sharedTestFiles: false,
//      maxInstances: 1
//    },
//    {
//      browserName: 'safari',
//      version: '13.1',
//      platform: 'macOS 10.15',
//      name: 'Media Viewer: macOS-latest-safari-tests',
//      tunnelIdentifier: 'reformtunnel',
//      extendedDebugging: true,
//      capturePerformance: true,
//      sharedTestFiles: false,
//      maxInstances: 1
//    },
//    {
//      browserName: 'MicrosoftEdge',
//      version: 'latest',
//      platform: 'Windows 10',
//      name: 'Media Viewer: windows-latest-microsoft-edge-tests',
//      tunnelIdentifier: 'reformtunnel',
//      extendedDebugging: true,
//      capturePerformance: true,
//      sharedTestFiles: false,
//      maxInstances: 1
//    }
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
