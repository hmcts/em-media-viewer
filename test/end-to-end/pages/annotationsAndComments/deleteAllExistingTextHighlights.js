'use strict'

const commonConfig = require('../../data/commonConfig.json');
const testConfig = require("../../../config");
const {assert} = require('chai')

module.exports = async function () {
  const I = this;
  
  let i = 0;

  const initial = await I.grabNumberOfVisibleElements(commonConfig.highLightTextCount);
  while (i < initial) {
    await I.click(commonConfig.highLightTextCount);
    await I.waitForElement(commonConfig.commentPopup.replace('Comment', 'Delete'));
    await I.click(commonConfig.commentPopup.replace('Comment', 'Delete'));
    ++i;
    const remaining = await I.grabNumberOfVisibleElements(commonConfig.highLightTextCount);
    assert.equal(remaining, initial - i);
  }
}
