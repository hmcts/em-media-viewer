const testConfig = require('./../../config');
const {enterShouldJumpViewerToNextSearchResult} = require("../helpers/mvCaseHelper");
const {navigateSearchResultsUsingPreviousNextLinksTest} = require("../helpers/mvCaseHelper");
const {createCaseInCcd} = require("../helpers/ccdDataStoreApi");
const {ccdEvents, mvData} = require('../pages/common/constants.js');
const {contentSearchTest, searchResultsNotFoundTest} = require("../helpers/mvCaseHelper");
let caseId;

Feature('Search Feature');

BeforeSuite(async ({I}) => caseId = await createCaseInCcd('test/end-to-end/data/ccd-case-basic-data.json'));

Scenario('Search Text in Document & validate total number of findings count', async ({I}) => {
  await contentSearchTest(I, caseId, ccdEvents.UPLOAD_DOCUMENT, mvData.CONTENT_SEARCH_KEYWORD, mvData.NUMBER_OF_FINDINGS);

}).tag('@ci')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);

Scenario('Navigate search results using previous/next links ', async ({I}) => {
  await navigateSearchResultsUsingPreviousNextLinksTest(I, caseId, mvData.CONTENT_SEARCH_KEYWORD, mvData.NUMBER_OF_FINDINGS);

}).tag('@ci')
  .tag('@nightly')
  .retry(testConfig.TestRetryScenarios);

Scenario('Search results not found scenario', async ({I}) => {
  await searchResultsNotFoundTest(I, caseId, ccdEvents.UPLOAD_DOCUMENT, mvData.SEARCH_RESULTS_NOT_FOUND, mvData.NO_RESULTS_FOUND);

}).tag('@nightly')
  .retry(testConfig.TestRetryScenarios)

Scenario('Enter should jump viewer to next search result', async ({I}) => {
  await enterShouldJumpViewerToNextSearchResult(I, caseId, mvData.CONTENT_SEARCH_KEYWORD, mvData.NUMBER_OF_FINDINGS);

}).tag('@nightly')
  .tag('@em-1619')
  .retry(testConfig.TestRetryScenarios)
