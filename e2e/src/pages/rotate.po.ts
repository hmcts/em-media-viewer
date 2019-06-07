import { by, element } from 'protractor';
import { AppPage } from './app.po';

export class RotatePage extends AppPage {

  height: number;
  width: number;

  rotateClockwise() {
    return element(by.id('pageRotateCw')).click();
  }

  rotateCounterClockwise() {
    return element(by.id('pageRotateCcw')).click();
  }

  async checkPdfIsRotated() {
    const originalHeight = this.height;
    const originalWidth = this.width;
    await this.captureCurrentOrientation();

    expect(this.width).toEqual(originalHeight);
    expect(this.height).toEqual(originalWidth);
  }

  checkImageIsRotatedBy(rotation: string) {
    expect(element(by.css('img')).getAttribute('style')).toEqual('transform: rotate('+ rotation +'deg);');
  }

  async captureCurrentOrientation() {
    await this.waitForElement(by.css('div[class="page"'));
    const pdfPage = await element(by.css('div[class="page"'));
    this.width = await pdfPage.getCssValue('width');
    this.height = await pdfPage.getCssValue('height');
  }
}
