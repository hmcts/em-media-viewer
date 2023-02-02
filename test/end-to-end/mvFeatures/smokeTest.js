const testConfig = require('../../config');
const {loginTest} = require("../helpers/mvCaseHelper");

Feature('ExUI login Smoke Test');

Scenario('Login to the manage case application', async ({I}) => {
  await loginTest(I);

}).retry(testConfig.TestRetryScenarios)
  .tag('@wip')
