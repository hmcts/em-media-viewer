const testConfig = require('../../config');

Feature('ExUI login Smoke Test');

Scenario('Login to the manage case application', async ({I}) => {
  await I.authenticateWithIdam();

}).retry(testConfig.TestRetryScenarios)
  .tag('@smoke')
