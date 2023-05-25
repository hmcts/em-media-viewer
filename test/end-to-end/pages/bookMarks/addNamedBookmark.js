'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function (name) {
  const I = this;

  await I.click(commonConfig.addBookmarkButton);
  console.log("add bookmark clicked");
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  await I.fillField(commonConfig.bookMarkInput, name);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  await I.click(commonConfig.bookMarkSave);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

}