import {by, element} from 'protractor';
import {AppPage} from './app.po';
import * as chai from 'chai';
import {GenericMethods} from '../utils/genericMethods';
import {browser} from 'protractor';

const genericMethods = new GenericMethods();
const {expect} = require('chai');

export class RedactPage extends AppPage {
  redact = by.id('mvRedactBtn');
  drawABox = by.id('toggleDrawButton');
  clickRedaction = by.css('mv-annotation .rectangle');
  clickRedactText = by.id('toggleHighlightButton');
  removeRedaction = by.css('mv-annotation .leftButton');
  clearAllRedactions = by.id('mvClearBtn');
  previewButton = by.id('mvPreviewBtn');
  changeDoc = by.css('app-media-viewer-wrapper .govuk-details__summary-text');
  saveButton = by.id('#mvDownloadBtn');

  async clickRedact() {
    await this.clickElement(this.redact);
  }

  async clickBox() {
    await this.clickElement(this.drawABox);
  }

  async clickText() {
    await this.clickElement(this.clickRedactText);
  }

  async notVisibleRedaction() {
    return this.removeRedactionMethod()
      .then(function () {
          throw new Error('Can click on redaction');
        },
        function () {
        });
  }

  async visibleRedaction() {
    await genericMethods.sleep(1000);
    await chai.expect((element(by.css('mv-annotation .rectangle'))).isPresent()).to.exist;
  }

  async removeRedactionMethod() {
    await browser.actions().mouseMove(element(by.css('mv-annotation .rectangle'))).perform();
    await this.clickElement(this.clickRedaction);
    await this.clickElement(this.removeRedaction);
  }

  async preview() {
    await genericMethods.sleep(5000);
    await browser.actions().mouseMove(element(by.id('mvPreviewBtn'))).perform();
    await this.clickElement(this.previewButton);
    await genericMethods.sleep(5000);
  }

  async save() {
    await this.clickElement(this.saveButton);
  }

  async clearAll() {
    await genericMethods.sleep(5000);
    await this.clickElement(this.clearAllRedactions);
    await genericMethods.sleep(5000);
  }

  async changeToDocStoreDoc() {
    await this.clickElement(this.changeDoc);
    const url = element(by.id('#documentUrl'));
    url.clear();
    url.sendKeys('documents/0b129c4e-e0a5-41fa-bbb2-7f30ddaf17cc/binary');

    const caseID = element(by.id('#caseId'));
    caseID.clear();
    caseID.sendKeys('0b129c4e-e0a5-41fa-bbb2-7f30ddaf17cc');
    // await this.clickElement(this.load);
  }

  async checkAllRedactionsCleared() {
    element.all(by.css('mv-annotation .rectangle')).count().then(function (rCount) {
      expect(rCount).to.equal(0);
    });
  }

  async checkPreview() {
    const redactions = element.all(by.css('mv-annotation .rectangle'));
    await genericMethods.sleep(500);
    const redactionsLength = await redactions.count();
    for (let i = 0; i < redactionsLength; i++) {
      const temp = await redactions.get(i);
      await genericMethods.sleep(1500);
      temp.getCssValue('background-color')
        .then(function (colour) {
          expect(colour).to.equal('rgba(0, 0, 0, 1)');
        });
    }
  }
}
