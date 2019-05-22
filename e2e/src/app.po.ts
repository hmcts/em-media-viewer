import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getHeaderText() {
    return element(by.css('app-sandbox-webapp h2')).getText();
  }

  getPdfViewer() {
    return element(by.css('a[id="pdf"]'));
  }

  getPdfNextPageButton() {
    return element(by.css('button[id="next"]'));
  }

  getPdfPreviousPageButton() {
    return element(by.css('button[id="previous"]'));
  }

  getPageNumberInput() {
    return element(by.css('input[id="pageNumber"]'));
  }
}
