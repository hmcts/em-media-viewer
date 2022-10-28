'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
const {mvData} = require("../common/constants");

module.exports = async function (searchKeyword, numberOfFindings) {

  const I = this;
  await I.click(commonConfig.documentsTab);
  await I.waitForText('example.pdf', testConfig.TestTimeToWaitForText);

  await I.click(commonConfig.examplePdfLink);
  await I.wait(5);
  await I.switchToNextTab(1);
  let currentPage = await I.grabCurrentUrl();
  console.log("Current Page Url=>::" + currentPage);

  await I.click(commonConfig.searchIcon);
  await I.fillField('//*[@aria-label=\'Find in document\']', searchKeyword);
  await I.click('//*[@id="toolbarContainer"]/div[1]/mv-search-bar/div/div[1]/div/button[1]');
  await I.seeTextEquals(numberOfFindings, '#findResultsCount');

  await I.click(commonConfig.nextLink);
  await I.seeTextEquals(mvData.VALIDATE_SEARCH_RESULTS_COUNT, '#findResultsCount');

  await I.click(commonConfig.prevLink);
  await I.seeTextEquals(mvData.NUMBER_OF_FINDINGS, '#findResultsCount');
};
