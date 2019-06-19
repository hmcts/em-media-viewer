// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts


exports.config = {
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
    //'../../features/*.feature',

  ],
  cucumberOpts: {
    compiler: 'ts:ts-node/register',
    format: 'pretty',
    require: ['./src/stepDefinitions/*.js', '../../typeScript/support/*.js'],
    strict: true,
    tags: '@Toolbar_ToggleButtons',
  },

}
