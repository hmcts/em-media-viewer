'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function (bundleDocumentName, assertBundlePage) {
  const I = this;
  await I.click(commonConfig.index)
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  let bundleDocsList = await I.grabTextFromAll(commonConfig.indexPageList);
  if (bundleDocsList.filter(bundleDocName => bundleDocName === bundleDocumentName)) {
    await I.retry(2).click(commonConfig.indexPageXp);
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
  }
  await I.seeTextEquals(assertBundlePage, commonConfig.selectTextToHighlight.replace('Apelydd', 'INDEX'))
};
