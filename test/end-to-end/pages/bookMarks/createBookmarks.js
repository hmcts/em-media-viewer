'use strict'
const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  
  await I.click(commonConfig.mvHighLight);
  const toolbar = await I.grabNumberOfVisibleElements(commonConfig.mvHighLightText);
  if (toolbar) {
    await I.click(commonConfig.mvHighLightText);
  }

  await I.executeScript(async () => {
    const range = document.createRange();
    const matchingElement = document.getElementsByClassName('textLayer')[0].children[6].children[1];
    range.selectNodeContents(matchingElement);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    const mouseUpEvent = document.createEvent('MouseEvents');
    mouseUpEvent.initMouseEvent('mouseup', true, true, window, 1, 844, 497, 937, 403, false, false, false, false, 0, null);
    const pageHandle = document.getElementsByClassName('textLayer')[0].children[6].children[1];
    pageHandle.dispatchEvent(mouseUpEvent);
  });

  await I.wait(testConfig.BookmarksAndAnnotationsWait);
  await I.click(commonConfig.bookMarksButton);
}
