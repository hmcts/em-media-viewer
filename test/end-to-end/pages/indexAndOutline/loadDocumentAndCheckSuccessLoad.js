'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
const chai = require('chai');


module.exports = async function (documentId) {
  const I = this;
  await I.click(commonConfig.changeDocumentDetails);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  await I.fillField(commonConfig.uploadDocumentUrl, `/documents/${documentId}/binary`);
  await I.wait(testConfig.TestTimeToWait);
  await I.click(commonConfig.loadDocument);
  await I.wait(testConfig.TestTimeToWait);
  await I.seeElement({ xpath: commonConfig.mvpdfviewer });;

};
