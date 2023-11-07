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
  await I.openHighlightToolbar();
  await I.click(commonConfig.highlightSearchButton);
  await I.redactFillSearchInput();
  await I.clickRedactSearchButton();
  const countText = await I.grabTextFrom(commonConfig.findRedactResultsCount);
  const countValueString = countText.replace('results founds', '')
  const countValue = Number(countValueString.trim());
  await I.clickRedactAllButton();
  await I.seeNumberOfVisibleElements(commonConfig.highLightTextCount, highlights + countValue);
}