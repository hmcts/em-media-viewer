import { browser, by, element, Locator } from 'protractor';
const fs = require('fs');

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getHeaderText() {
    return element(by.css('app-sandbox-webapp h2')).getText();
  }

  selectPdfViewer() {
    element(by.id('pdf')).click();
  }

  getPdfPage() {
    return element(by.css('div[class="page"'));
  }

  selectImageViewer() {
    return element(by.id('image')).click();
  }

  selectUnsupportedViewer() {
    return element(by.id('unsupported')).click();
  }

  goToNextPage() {
    return element(by.id('next')).click();
  }

  goToPreviousPage() {
    return element(by.id('previous')).click();
  }

  getPageNumberInput() {
    return element(by.id('pageNumber'));
  }

  zoomIn() {
    return element(by.id('zoomIn')).click();
  }

  zoomOut() {
    return element(by.id('zoomOut')).click();
  }

  getCurrentZoomOption() {
    return element(by.id('customScaleOption'));
  }

  selectZoom() {
    return element(by.id('scaleSelect')).click();
  }

  selectZoomValue(zoomOption) {
    return element(by.cssContainingText('select[id="scaleSelect"] option', zoomOption)).click();
  }

  rotateClockwise() {
    return element(by.id('pageRotateCw')).click();
  }

  rotateCounterClockwise() {
    return element(by.id('pageRotateCcw')).click();
  }

  clickDownload() {
    return element(by.id('download')).click();
  }

  clickPrint() {
    return element(by.id('print')).click();
  }

  getPrintDialog() {
    return element(by.css('print-preview-app'));
  }

  toggleSearchBar() {
    return element(by.id('viewFind')).click();
  }

  async hasFileDownloaded(filePath) {
    await browser.wait(async () => fs.existsSync(filePath), 3000, 'File failed to download');
    return fs.existsSync(filePath);
  }

  getBrowserTabs() {
    return browser.getAllWindowHandles();
  }


  async waitForElement(selector: Locator) {
    await browser.wait(async () => element(selector), 3000, 'failed to load search results');
  }

  async waitForArray(selector: Locator) {
    await browser.wait(async () => element.all(selector), 3000, 'failed to load search results');
  }
}
