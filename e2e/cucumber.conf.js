// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts
"use strict";

exports.config = {

  SELENIUM_PROMISE_MANAGER: false,

  allScriptsTimeout: 120000,
  getPageTimeout: 120000,
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),

  capabilities:
    {
    browserName: 'chrome',
    },


  directConnect: true,
  baseUrl: 'http://localhost:3000/',

  specs: [
    './src/**/*.feature',

  ],
  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
  },

  cucumberOpts: {
    compiler: 'ts:ts-node/register',
    strict: true,
    plugin: ["pretty"],
    require: ['../dist/e2e/src/step-definitions/*.js', '../../typeScript/support/*.js'],
    tags: '@Toolbar_ToggleButtons',
  },

  noGlobals: true,
  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
  }

};
