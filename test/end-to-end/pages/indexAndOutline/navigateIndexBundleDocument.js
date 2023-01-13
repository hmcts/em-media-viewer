'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
const chai = require('chai');


module.exports = async function (bundleDocumentName, bundlePageNumber, assertBundlePage) {
  const I = this;
  await I.click(commonConfig.index);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  
  const xP = commonConfig.indexPageXp.replace(('Index Page'), bundleDocumentName).replace('2', bundlePageNumber);

  let bgColor = await I.grabCssPropertyFrom(xP,'background-color');
  chai.expect(bgColor).to.equal('rgba(0, 0, 0, 0)');
  

  let bundleDocsList = await I.grabTextFromAll(commonConfig.indexPageList);
  if (bundleDocsList.filter(bundleDocName => bundleDocName === bundleDocumentName)) {
    await I.retry(2).click(xP);
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
  }

  bgColor = await I.grabCssPropertyFrom(xP,'background-color');
  chai.expect(bgColor).to.equal('rgb(255, 255, 255)');

  await I.seeTextEquals(assertBundlePage, commonConfig.selectTextToHighlight.replace('Apelydd', assertBundlePage));

};
