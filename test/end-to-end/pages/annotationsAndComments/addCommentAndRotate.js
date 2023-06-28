'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  
  await I.retry(2).click(commonConfig.rotateRightBtn);

  await I.highlightPdfText();
  await I.retry(2).click(commonConfig.highLightPopup);
  await I.waitForElement(commonConfig.commentPopup, 10);
  await I.retry(2).click(commonConfig.commentPopup);
  await I.fillField(commonConfig.firstCommentXp, commonConfig.firstComment1);
  await I.retry(3).click(commonConfig.saveButton);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  await I.click(commonConfig.mvHighLight);
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  await I.executeScript(async () => {
    const range = document.createRange();
    const matchingElement = document.getElementsByClassName('textLayer')[0].children[3];
    range.selectNodeContents(matchingElement);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    const mouseUpEvent = document.createEvent('MouseEvents');
    mouseUpEvent.initEvent('mouseup', true, true)
    const pageHandle = document.getElementsByClassName('textLayer')[0].children[3];
    pageHandle.dispatchEvent(mouseUpEvent);
  });
  await I.wait(testConfig.BookmarksAndAnnotationsWait);

  await I.retry(3).click(commonConfig.rotateLeftBtn);
}
