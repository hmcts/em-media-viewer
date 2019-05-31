import { browser, by, element } from 'protractor';
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

  clickSearch() {
    return element(by.id('viewFind')).click();
  }

  getSearchInput() {
    return element(by.css('input[title="Find"]'));
  }

  searchNext() {
    return element(by.id('findNext')).click();
  }

  searchPrevious() {
    return element(by.id('findPrevious')).click();
  }

  async getCurrentSearchResult() {
    const selector = by.className('highlight selected');
    await browser.wait(async () => element(selector), 3000, 'failed to load search results');
    return await element(selector);
  }

  getAllSearchHighlights() {
    return element.all(by.css('.highlight'));
  }

  selectHighlightAll() {
    return element(by.id('findHighlightAll')).click();
  }

  selectMatchCase() {
    return element(by.id('findMatchCase')).click();
  }

  selectWholeWords() {
    return element(by.id('findEntireWord')).click();
  }

  async getSearchResultsCount() {
    const selector = by.id('findResultsCount');
    await browser.wait(async () => element(selector), 3000, 'failed to load search results');
    return element(selector);
  }

  async hasFileDownloaded(filePath) {
    await browser.wait(async () => fs.existsSync(filePath), 3000, 'File failed to download');
    return fs.existsSync(filePath);
  }

  getBrowserTabs() {
    return browser.getAllWindowHandles();
  }
}
