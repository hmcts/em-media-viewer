import { AppPage } from '../app.po';
import { browser, by, element, protractor } from 'protractor';

describe('rotate', () => {
  let page: AppPage;
  const until = protractor.ExpectedConditions;

  beforeEach(() => {
    page = new AppPage();
  });


  it('should display rotated pdf by 90 degree', async () => {
    page.selectPdfViewer();
    await browser.wait(until.presenceOf(page.getPdfPage()), 3000, 'PDF viewer taking too long to load');

    const pdfPage = page.getPdfPage();
    const pdfWidth = pdfPage.getCssValue('width');
    const pdfHeight = pdfPage.getCssValue('height');

    page.rotateClockwise();

    expect(pdfPage.getCssValue('width')).toEqual(pdfHeight);
    expect(pdfPage.getCssValue('height')).toEqual(pdfWidth);
  });

  it('should display rotated pdf by -90 degrees', () => {
    const pdfPage = element(by.css('div[class="page"'));
    const pdfWidth = pdfPage.getCssValue('width');
    const pdfHeight = pdfPage.getCssValue('height');

    page.rotateCounterClockwise();

    expect(pdfPage.getCssValue('width')).toEqual(pdfHeight);
    expect(pdfPage.getCssValue('height')).toEqual(pdfWidth);
  });

  it('should display rotated pdf by 360 degrees clockwise', () => {
    const pdfPage = element(by.css('div[class="page"'));
    const pdfWidth = pdfPage.getCssValue('width');
    const pdfHeight = pdfPage.getCssValue('height');

    page.rotateClockwise();
    expect(pdfPage.getCssValue('width')).toEqual(pdfHeight);
    expect(pdfPage.getCssValue('height')).toEqual(pdfWidth);

    page.rotateClockwise();
    expect(pdfPage.getCssValue('width')).toEqual(pdfWidth);
    expect(pdfPage.getCssValue('height')).toEqual(pdfHeight);

    page.rotateClockwise();
    expect(pdfPage.getCssValue('width')).toEqual(pdfHeight);
    expect(pdfPage.getCssValue('height')).toEqual(pdfWidth);

    page.rotateClockwise();
    expect(pdfPage.getCssValue('width')).toEqual(pdfWidth);
    expect(pdfPage.getCssValue('height')).toEqual(pdfHeight);
  });

  it('should display rotated image by 90 degree', () => {
    page.selectImageViewer();

    page.rotateClockwise();
    expect(element(by.css('img')).getAttribute('style')).toEqual('transform: rotate(90deg);');
  });

  it('should display rotated image by -90 degrees', () => {
    page.rotateCounterClockwise();
    expect(element(by.css('img')).getAttribute('style')).toEqual('transform: rotate(0deg);');
  });

  it('should display rotated image by 360 degrees clockwise', () => {
    page.rotateClockwise();
    expect(element(by.css('img')).getAttribute('style')).toEqual('transform: rotate(90deg);');

    page.rotateClockwise();
    expect(element(by.css('img')).getAttribute('style')).toEqual('transform: rotate(180deg);');

    page.rotateClockwise();
    expect(element(by.css('img')).getAttribute('style')).toEqual('transform: rotate(270deg);');

    page.rotateClockwise();
    expect(element(by.css('img')).getAttribute('style')).toEqual('transform: rotate(360deg);');
  });
});
