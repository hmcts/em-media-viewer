'use strict'
const commonConfig = require('../../data/commonConfig.json');
const chai = require('chai');

module.exports = async function (nestedDocumentName, nestedPageNumber, pageContent) {
    const I = this;

    const transparent = 'rgba(0, 0, 0, 0)';
    const white = 'rgb(255, 255, 255)';
    

    const xP = commonConfig.indexPageXp.replace(('Index Page'), nestedDocumentName).replace('2', nestedPageNumber);
    const parentXP = commonConfig.indexPageXp.replace(('Index Page'), commonConfig.parentDocumentName).replace('2', commonConfig.parentPageNumber);
    const lastParentXP = commonConfig.indexPageXp.replace(('Index Page'), commonConfig.lastParentName).replace('2', commonConfig.lastParentNumber);

    await I.navigateIndexBundleDocument(nestedDocumentName, nestedPageNumber, pageContent);

    let bgColor = await I.grabCssPropertyFrom(xP,'background-color');
    chai.expect(bgColor).to.equal(white);
     
    bgColor = await I.grabCssPropertyFrom(parentXP,'background-color');
    chai.expect(bgColor).to.equal(white);

    bgColor = await I.grabCssPropertyFrom(lastParentXP,'background-color');
    chai.expect(bgColor).to.equal(transparent);


    await I.retry(2).click(lastParentXP);

    bgColor = await I.grabCssPropertyFrom(xP,'background-color');
    chai.expect(bgColor).to.equal(transparent);
     
    bgColor = await I.grabCssPropertyFrom(parentXP,'background-color');
    chai.expect(bgColor).to.equal(transparent);

    bgColor = await I.grabCssPropertyFrom(lastParentXP,'background-color');
    chai.expect(bgColor).to.equal(white);


  };