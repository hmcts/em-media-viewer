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
    return element(by.css('a[id="pdf"]'));
  }

  getImageViewer() {
    return element(by.css('a[id="image"]'));
  }

  getUnsupportedViewer() {
    return element(by.css('a[id="unsupported"]'));
  }

  getNextPageButton() {
    return element(by.css('button[id="next"]'));
  }

  getPreviousPageButton() {
    return element(by.css('button[id="previous"]'));
  }

  getPageNumberInput() {
    return element(by.css('input[id="pageNumber"]'));
  }

  getZoomInButton() {
    return element(by.css('button[id="zoomIn"]'));
  }

  getZoomOutButton() {
    return element(by.css('button[id="zoomOut"]'));
  }

  getCurrentZoomOption() {
    return element(by.css('option[id="customScaleOption"]'));
  }

  getZoomSelect() {
    return element(by.css('select[id="scaleSelect"]'));
  }

  selectZoomValue(zoomOption) {
    return element(by.cssContainingText('select[id="scaleSelect"] option', zoomOption));
  }

  getClockwiseRotateButton() {
    return element(by.css('button[id="pageRotateCw"]'));
  }

  getCounterClockwiseRotateButton() {
    return element(by.css('button[id="pageRotateCcw"]'));
  }

  getDownloadButton() {
    return element(by.css('button[id="download"]'));
  }

  getPrintButton() {
    return element(by.css('button[id="print"]'));
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
    return element.all(by.id('findHighlightAll'));
  }

  selectFindMatchCase() {
    return element.all(by.id('findMatchCase'));
  }

  selectFindEntireWord() {
    return element.all(by.id('findEntireWord'));
  }

  getSearchResultsCount() {
    return element(by.id('findResultsCount'));
  }

  hasFileDownloaded(filePath) {
    return fs.existsSync(filePath);
  }
}
