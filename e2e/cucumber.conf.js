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

  specs: [
    //'./src/**/*.e2e-spec.ts',
    './src/features/*.feature',

  ],
  directConnect: true,
  baseUrl: 'http://localhost:3000/',

  cucumberOpts: {
    monochrome: true,
    strict: true,
    compiler:   'ts:ts-node/register',
    format: 'pretty',
    profile: false,
    'no-source': true,
    require: './src/stepDefinitions/*.ts',
    tags: '@Toolbar_ToggleButtons'
  }

}
