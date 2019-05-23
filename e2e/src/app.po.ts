import { browser, by, element } from 'protractor';
const fs = require('fs');

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  wait(amount) {
    return browser.sleep(amount);
  }

  getHeaderText() {
    return element(by.css('app-sandbox-webapp h2')).getText();
  }

  getPdfViewer() {
    return element(by.id('pdf'));
  }

  getImageViewer() {
    return element(by.id('image'));
  }

  getUnsupportedViewer() {
    return element(by.id('unsupported'));
  }

  getNextPageButton() {
    return element(by.id('next'));
  }

  getPreviousPageButton() {
    return element(by.id('previous'));
  }

  getPageNumberInput() {
    return element(by.id('pageNumber'));
  }

  getZoomInButton() {
    return element(by.id('zoomIn'));
  }

  getZoomOutButton() {
    return element(by.id('zoomOut'));
  }

  getCurrentZoomOption() {
    return element(by.id('customScaleOption'));
  }

  getZoomSelect() {
    return element(by.id('scaleSelect'));
  }

  selectZoomValue(zoomOption) {
    return element(by.cssContainingText('select[id="scaleSelect"] option', zoomOption));
  }

  getClockwiseRotateButton() {
    return element(by.id('pageRotateCw'));
  }

  getCounterClockwiseRotateButton() {
    return element(by.id('pageRotateCcw'));
  }

  getDownloadButton() {
    return element(by.id('download'));
  }

  getPrintButton() {
    return element(by.id('print'));
  }

  getPrintDialog() {
    return element(by.css('print-preview-app'));
  }

  getSearchButton() {
    return element(by.id('viewFind'));
  }

  getSearchInput() {
    return element(by.css('input[title="Find"]'));
  }

  getNextSearchButton() {
    return element(by.id('findNext'));
  }

  getPreviousSearchButton() {
    return element(by.id('findPrevious'));
  }

  getCurrentSearchResult() {
    return element(by.className('highlight selected'));
  }

  getAllSearchHighlights() {
    return element.all(by.css('.highlight'));
  }

  selectFindAllHighlight() {
    return element(by.id('findHighlightAll'));
  }

  selectFindMatchCase() {
    return element(by.id('findMatchCase'));
  }

  selectFindEntireWord() {
    return element(by.id('findEntireWord'));
  }

  getSearchResultsCount() {
    return element(by.id('findResultsCount'));
  }

  hasFileDownloaded(filePath) {
    return fs.existsSync(filePath);
  }
}
