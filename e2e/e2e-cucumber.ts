import {browser, Config} from 'protractor';

export const config: Config = {


  SELENIUM_PROMISE_MANAGER: false,

  baseUrl: 'http://localhost:3000/',

  capabilities: {
    browserName: 'chrome',
  },

  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  specs: [
    '../../../features/*.feature',
  ],

  onPrepare: () => {
    browser.ignoreSynchronization = true;
    browser.manage().window().maximize();
  },

  cucumberOpts: {
    compiler: 'ts:ts-node/register',
    format: 'pretty',
    require: ['../../../typeScript/stepDefinitions/*.js', '../../../typeScript/support/*.js'],
    strict: true,
    tags: '@Toolbar_ToggleButtons',
  },

  onComplete: () => {
    /*Reporter.createHTMLReport(); */
  },
};
