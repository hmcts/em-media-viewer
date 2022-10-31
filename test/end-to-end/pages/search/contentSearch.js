'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
const {mvData} = require("../common/constants");

module.exports = async function (searchKeyword, numberOfFindings) {

  const I = this;
  if (mvData.SEARCH_RESULTS_NOT_FOUND === searchKeyword) {
    await I.click(commonConfig.documentsTab);
    await I.waitForText('example.pdf', testConfig.TestTimeToWaitForText);
  }
  await I.click(commonConfig.examplePdfLink);
  await I.wait(5);
  await I.switchToNextTab(1);
  let currentPage = await I.grabCurrentUrl();
  console.log("Current Page Url=>::" + currentPage);

  await I.click(commonConfig.searchIcon);
  await I.fillField('//*[@aria-label=\'Find in document\']', searchKeyword);
  await I.click('//*[@id="toolbarContainer"]/div[1]/mv-search-bar/div/div[1]/div/button[1]');
  await I.seeTextEquals(numberOfFindings, '#findResultsCount')
};
