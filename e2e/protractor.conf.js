// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
const fs = require('fs');

exports.config = {
  allScriptsTimeout: 120000,
  getPageTimeout: 120000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  multiCapabilities: [
    {
      'browserName': 'firefox',
      directConnect: true,
      'moz:firefoxOptions': {
        'args': ['--safe-mode']
      }
    },

    {
    browserName: 'chrome',
    chromeOptions: {
      prefs: {
        download: {
          'prompt_for_download': false,
          'default_directory': require('path').join(__dirname, 'src/downloads')
        }
      }
    }
  },

  ],
  maxSessions: 2,
  shardTestFiles: true,
  directConnect: true,
  baseUrl: 'http://localhost:3000/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {},
    includeStackTrace: true,
    isVerbose: true
  },

  onPrepare() {
    require('ts-node').register({
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    removePreviousDownloads();
  },
  onCleanUp() {
    removePreviousDownloads();
  }
};

function removePreviousDownloads() {
  try {
    const downloadsPath = 'e2e/src/downloads';
    const files = fs.readdirSync(downloadsPath);
    if (files.length > 0)
      for (let i = 0; i < files.length; i++) {
        let filePath = downloadsPath + '/' + files[i];
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      }
  }
  catch(e) {
    console.log(e);
    return e;
  }

}
