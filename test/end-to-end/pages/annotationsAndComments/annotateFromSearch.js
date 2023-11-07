'use strict'
const commonConfig = require('../../data/commonConfig.json');

module.exports = async function () {

  const I = this;
  const visible = await I.grabNumberOfVisibleElements(commonConfig.drawBox);
  if (visible) {
    console.log('Draw box is visible, skipping test');
    return;
  }
  const highlights = await I.grabNumberOfVisibleElements(commonConfig.highLightTextCount);
  console.log(highlights);
  await I.openHighlightToolbar();
  await I.click(commonConfig.highlightSearchButton);
  await I.redactFillSearchInput();
  await I.clickRedactSearchButton();
  await I.clickRedactAllButton();
  console.log(highlights);
  await I.seeNumberOfVisibleElements(commonConfig.highLightTextCount, highlights + 8);
}