'use strict'
const commonConfig = require('../../data/commonConfig.json');

module.exports = async function (searchKeyword, numberOfFindings) {
  const I = this;
  await I.click(commonConfig.searchIcon);
  await I.fillField('//*[@aria-label=\'Search document\']', searchKeyword);
  await I.click('//*[@id="mvToolbarMain"]/mv-search-bar/div/div[1]/div/button[1]');
  await I.seeTextEquals(numberOfFindings, '#findResultsCount')
};
