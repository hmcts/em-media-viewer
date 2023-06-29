'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
let i = 0;
let commentsList

module.exports = async function (annotationToDelete) {
  const I = this;
  commentsList = await I.grabTextFromAll(commonConfig.commentsCount);

  // if (commentsList.filter(comment => comment === annotationToDelete)) {
  //   await I.click(commonConfig.deleteAnnotationText);
  //   await I.wait(testConfig.BookmarksAndAnnotationsWait);
  //   await I.click(commonConfig.deleteAnnotationBtn);
  //   await I.wait(testConfig.BookmarksAndAnnotationsWait);
  // }

  while (i < await I.getBookmarksCount(commonConfig.commentsCount)) {
    await I.click(commonConfig.commentsCount);
    await I.waitForElement(commonConfig.deleteAnnotationBtn, 10);
    await I.click(commonConfig.deleteAnnotationBtn);
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
  }
  await I.refreshPage();
};
