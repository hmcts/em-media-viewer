const testConfig = require('../../config');

Feature('ExUI login Smoke Test');

Scenario('login to the manage case application', async ({I}) => {
  await I.authenticateWithIdam();

}).retry(testConfig.TestRetryScenarios)
  .tag('@smoke')
