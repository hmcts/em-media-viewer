'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
let commentsList

module.exports = async function () {
  const I = this;
  let i = 0;

  const visible = await I.grabNumberOfVisibleElements(commonConfig.commentsCount)
  console.log(visible);
  while (i < visible) {
    await I.retry(3).click(commonConfig.commentsCount);
    console.log('i', i);
    await I.waitForElement(commonConfig.deleteAnnotationBtn, 30);
    await I.retry(3).click(commonConfig.deleteAnnotationBtn);
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
    ++i;
  }
  await I.refreshPage();
};
