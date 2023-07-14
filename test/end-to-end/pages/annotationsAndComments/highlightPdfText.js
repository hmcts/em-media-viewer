'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
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
  await I.waitForElement(commonConfig.highLightPopup, commonConfig.BookmarksAndAnnotationsWait);
  await I.retry(2).click(commonConfig.highLightPopup);
  await I.wait(commonConfig.BookmarksAndAnnotationsWait);
  await I.click(commonConfig.highLightTextCount);
}
