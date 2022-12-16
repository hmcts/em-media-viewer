const testConfig = require('../../config');

Feature('ExUI login Smoke Test');

Scenario('Login to the manage case application', async ({I}) => {
  console.log("Jenkins Execution Environment name:" + process.env.TEST_URL);
  console.log("Jenkins Execution Environment name1:" + process.env.TEST_URL);
  // await I.authenticateWithIdam();

}).retry(testConfig.TestRetryScenarios)
  .tag('@smoke')
