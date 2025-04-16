'use strict'
const commonConfig = require('../../data/commonConfig.json');
const {mvData} = require("../common/constants");
const testConfig = require("../../../config");

module.exports = async function (pageToNavigate) {
  const I = this;

  if (pageToNavigate === mvData.PAGE_NAVIGATION_NUMBER) {
    await I.retry(2).click(commonConfig.moveDown);
    await I.click('#viewerContainer')
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
      // await I.seeInField(commonConfig.pageNumber, mvData.PAGE_NAVIGATION_NUMBER);
  } else {
    await I.wait(3);
    await I.clearField(commonConfig.pageNumber);
    await I.fillField(commonConfig.pageNumber, pageToNavigate);
    await I.pressKey('Enter');
    await I.click('#viewerContainer');
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
    await I.seeInField(commonConfig.pageNumber, pageToNavigate);
  }
};
