const config = require('../config');

exports.config = {
    tests: config.TestPathToRun,
    output: `${process.cwd()}/${config.TestOutputDir}`,
    helpers: {
        Puppeteer: {
            url: config.TestUrl,
            waitForTimeout: 40000,
            getPageTimeout: 40000,
            // waitForAction: 1000,
            show: config.TestShowBrowserWindow,
            waitForNavigation: ['domcontentloaded'],
            restart: true,
            keepCookies: false,
            keepBrowserState: false,
            chrome: {
                ignoreHTTPSErrors: true,
                'ignore-certificate-errors': true,
                'defaultViewport': {
                    'width': 1280,
                    'height': 960
                },
                args: [
                    '--headless',
                    '--disable-gpu',
                    '--no-sandbox',
                    '--allow-running-insecure-content',
                    '--ignore-certificate-errors',
                    '--window-size=1440,1400'
                ]
            },
        },
        PuppeteerHelper: {
            require: './helpers/PuppeteerHelper.js'
        },
      REST: {
        endpoint: ''
      },
      JSONResponse: {
        requestHelper: 'REST',
      },
        JSWait: {require: './helpers/JSWait.js'},
    },
    include: {
        I: './pages/steps.js'
    },
    plugins: {
        screenshotOnFail: {
            enabled: true,
            fullPageScreenshots: true
        },
        retryFailedStep: {
            enabled: true,
            retries: 1
        },
        autoDelay: {
            enabled: true
        }
    },
    mocha: {
        reporterOptions: {
            'codeceptjs-cli-reporter': {
                stdout: '-',
                options: {steps: true}
            },
            'mocha-junit-reporter': {
                stdout: '-',
                options: {mochaFile: './functional-output/result.xml'}
            },
            mochawesome: {
                stdout: './functional-output/mv-e2e-mochawesome-stdout.log',
                options: {
                    reportDir: config.TestOutputDir || './functional-output',
                    reportFilename: 'mv-e2e-result',
                    inlineAssets: true,
                    reportTitle: 'MV E2E Tests'
                }
            }
        }
    },
    multiple: {
        parallel: {
            chunks: 2,
            browsers: ['chrome']
        }
    },
    'name': 'mv-e2e-tests'
};
