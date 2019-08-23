import {browser, by, element, ElementFinder} from 'protractor';
import {AppPage} from './app.po';
import {expect} from 'chai';

export class RotatePage extends AppPage {

  rotateBtn: ElementFinder = element(by.css('#rotate-btn-toggle'));

  height: number;
  width: number;

  async rotateClockwise() {
    await this.clickElement(by.id('pageRotateCw'));
  }

  async rotateCounterClockwise() {
    await this.clickElement(by.id('pageRotateCcw'));
  }

  async checkPdfIsRotated() {
    const originalHeight = this.height;
    const originalWidth = this.width;
    await this.captureCurrentOrientation();

    await expect(this.width).equal(originalHeight);
    await expect(this.height).equal(originalWidth);
  }

  async checkImageIsRotatedBy(rotation: string) {
    const el = await element(by.css('img'));
    const elementStyle = await el.getAttribute('style');
    expect('transform: rotate(' + rotation + 'deg);').equals('transform: rotate(' + rotation + 'deg);');
  }

  async captureCurrentOrientation() {
    await this.waitForElement(by.css('div[class="page"'));
    const pdfPage = await element(by.css('div[class="page"'));
    this.width = await pdfPage.getCssValue('width');
    this.height = await pdfPage.getCssValue('height');
  }

  async clickRotateButton() {
    await browser.sleep(5000);
    const selected = await this.rotateBtn.isSelected();
    if (!selected) {
      await this.rotateBtn.click();
    }
  }
}
