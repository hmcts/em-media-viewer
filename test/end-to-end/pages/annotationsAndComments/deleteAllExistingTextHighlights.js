'use strict'

const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");

module.exports = async function () {
  const I = this;
  
  let i = 0;

  const visible = await I.grabNumberOfVisibleElements(commonConfig.highLightTextCount);
  while (i < visible) {
    await I.retry(3).click(commonConfig.highLightTextCount);
    await I.waitForElement(commonConfig.commentPopup.replace('Comment', 'Delete'));
    await I.retry(3).click(commonConfig.commentPopup.replace('Comment', 'Delete'));
    ++i;
    await I.seeNumberOfVisibleElements(commonConfig.highLightTextCount, visible - i);
  }

  await I.seeNumberOfVisibleElements(commonConfig.highLightTextCount, 0);

}
