import { browser, by, element, Locator, protractor } from 'protractor';
const until = protractor.ExpectedConditions;

export class AppPage {

  navigateTo() {
    return browser.get('/');
  }


  toggleToolbarButtons() {
    element(by.css("label[for='search-btn-toggle']")).click();
    element(by.css("label[for='navigate-btn-toggle']")).click();
    element(by.css("label[for='rotate-btn-toggle']")).click();
    element(by.css("label[for='zoom-btn-toggle']")).click();
    element(by.css("label[for='print-btn-toggle']")).click();
    element(by.css("label[for='download-btn-toggle']")).click();
  }

  getHeaderText() {
    return element(by.css('media-viewer-wrapper h2')).getText();
  }

  selectPdfViewer() {
    element(by.id('pdf')).click();
  }

  selectImageViewer() {
    return element(by.id('image')).click();
  }

  selectUnsupportedViewer() {
    return element(by.id('unsupported')).click();
  }

  async waitForPdfToLoad() {
    await browser.wait(until.presenceOf(element(by.css('div[class="page"'))), 3000, 'PDF viewer taking too long to load');
  }

  async waitForElement(selector: Locator) {
    await browser.wait(async () => element(selector), 3000, 'failed to load search results');
  }

  async waitForElementsArray(selector: Locator) {
    await browser.wait(async () => element.all(selector), 3000, 'failed to load search results');
  }
}
