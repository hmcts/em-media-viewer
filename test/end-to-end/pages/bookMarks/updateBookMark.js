'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
const {mvData} = require('../common/constants');

module.exports = async function () {
  const I = this;
  await I.click(commonConfig.addBookmarkButton);
  await I.wait(testConfig.BookmarksWait);
  await I.click(commonConfig.bookMarkRename);
  await I.wait(testConfig.TestTimeToWait);

  await I.clearField(commonConfig.bookMarkInput);
  await I.wait(testConfig.BookmarksWait);
  await I.fillField(commonConfig.bookMarkInput, mvData.BOOKMARK_UPDATE);
  await I.wait(testConfig.BookmarksWait);

  await I.click(commonConfig.bookMarkSave);
  await I.wait(testConfig.BookmarksWait);
}
