const testConfig = require('./../../config');
const {createCaseInCcd} = require("../helpers/ccdDataStoreApi");
const {mvData} = require('../pages/common/constants.js');
const {mediaViewerContentSearch} = require("../helpers/mvCaseHelper");
let caseId;

Feature('Search Feature');

BeforeSuite(async ({I}) => caseId = await createCaseInCcd('test/end-to-end/data/ccd-case-basic-data.json'));

Scenario('Verify Content Search & Search count within document', async ({I}) => {
  await mediaViewerContentSearch(I, caseId, mvData.CONTENT_SEARCH_KEYWORD, mvData.NUMBER_OF_FINDINGS);

}).tag('@ci')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);
