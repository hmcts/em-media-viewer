const testConfig = require('./../../config');
const {
  enterShouldJumpViewerToNextSearchResultsTest,
  navigateSearchResultsUsingPreviousNextLinksTest,
  contentSearchTest,
  searchResultsNotFoundTest
} = require("../helpers/mvCaseHelper");
const {mvData} = require('../pages/common/constants.js');

Feature('Search Feature');

Scenario('Search Text in Document & validate total number of findings count', async ({I}) => {
  await contentSearchTest(I, mvData.INDEX_AND_OUTLINE, mvData.CONTENT_SEARCH_KEYWORD, mvData.NUMBER_OF_FINDINGS, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Navigate search results using previous & next links ', async ({I}) => {
  await navigateSearchResultsUsingPreviousNextLinksTest(I, mvData.INDEX_AND_OUTLINE, mvData.CONTENT_SEARCH_KEYWORD, mvData.NUMBER_OF_FINDINGS, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios);

Scenario('Search results not found scenario', async ({I}) => {
  await searchResultsNotFoundTest(I, mvData.INDEX_AND_OUTLINE, mvData.SEARCH_RESULTS_NOT_FOUND, mvData.NO_RESULTS_FOUND, mvData.PDF_DOCUMENT);

}).tag('@ci')
  .retry(testConfig.TestRetryScenarios)

Scenario('Enter should jump viewer to next search result', async ({I}) => {
  await enterShouldJumpViewerToNextSearchResultsTest(I, mvData.INDEX_AND_OUTLINE, mvData.CONTENT_SEARCH_KEYWORD, mvData.NUMBER_OF_FINDINGS, mvData.PDF_DOCUMENT);

}).tag('@np')
  .tag('@em-1619')
  .retry(testConfig.TestRetryScenarios)
