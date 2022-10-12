const testConfig = require('../../config');

Feature('Login smoke scenario');

Scenario('login to the manage case application', async ({ I }) => {
    await I.authenticateWithIdam();

}).retry(testConfig.TestRetryScenarios)
    .tag('@smoke')
