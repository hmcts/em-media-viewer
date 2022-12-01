'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
let i = 0;

module.exports = async function (annotationToDelete) {

  const I = this;
  await I.click(commonConfig.moreOptionsButton)
  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.click(commonConfig.commentsBtn);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  if (await I.getBookmarksCount(commonConfig.commentsCount) !== 0) {
    await I.deleteAllComments(annotationToDelete);
  } else {
    console.log("Creating Annotation")
    await I.refreshPage();
    await I.createAnnotation();

    await I.click(commonConfig.moreOptionsButton)
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
    await I.click(commonConfig.commentsBtn);
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
  }

  while (i < await I.getBookmarksCount(commonConfig.commentsCount)) {
    // await I.scrollUp(commonConfig.deleteAnnotationText)
    await I.click(commonConfig.commentsCount);
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
    await I.click(commonConfig.deleteAnnotationBtn);
    await I.wait(testConfig.BookmarksAndAnnotationsWait);
  }
  await I.refreshPage();
  // let deletedCommentsCount = commentsList.filter(async (comment) => {
  //   if (comment === annotationToDelete) {
  //     console.log('Comment Name Found ==>::' + comment);
  //     // await I.click(commonConfig.deleteAnnotationText);
  //     // await I.wait(testConfig.BookmarksAndAnnotationsWait);
  //     // await I.click(commonConfig.deleteAnnotationBtn);
  //     // await I.wait(testConfig.BookmarksAndAnnotationsWait);
  //     console.log('Deleted Comment Name ==>::' + comment);
  //     // deleteComment = deleteComment + 1;
  //   }
  //    // return deleteComment;
  // });

};
