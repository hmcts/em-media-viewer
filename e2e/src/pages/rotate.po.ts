import { by, element } from 'protractor';
import { AppPage } from './app.po';

export class RotatePage extends AppPage {

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

    expect(this.width).toEqual(originalHeight);
    expect(this.height).toEqual(originalWidth);
  }

  async checkImageIsRotatedBy(rotation: string) {
    const el = await element(by.css('img'));
    const elementStyle = await el.getAttribute('style');
    expect(elementStyle).toEqual('transform: rotate(' + rotation + 'deg);');
  }

  async captureCurrentOrientation() {
    await this.waitForElement(by.css('div[class="page"'));
    const pdfPage = await element(by.css('div[class="page"'));
    this.width = await pdfPage.getCssValue('width');
    this.height = await pdfPage.getCssValue('height');
  }
}
