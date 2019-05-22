import { browser, by, element } from 'protractor';

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
}
