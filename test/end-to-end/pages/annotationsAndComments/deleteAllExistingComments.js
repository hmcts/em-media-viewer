'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
let i = 0;
let commentsList

module.exports = async function (annotationToDelete) {
  const I = this;
  //commentsList = await I.grabTextFromAll(commonConfig.commentsCount);

  // if (commentsList.filter(comment => comment === annotationToDelete)) {
  //   await I.click(commonConfig.deleteAnnotationText);
  //   await I.wait(testConfig.BookmarksAndAnnotationsWait);
  //   await I.click(commonConfig.deleteAnnotationBtn);
  //   await I.wait(testConfig.BookmarksAndAnnotationsWait);
  // }

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
