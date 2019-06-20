import { browser, by, element, Locator, protractor } from 'protractor';
const until = protractor.ExpectedConditions;

export class AppPage {

  async navigateTo() {
    await browser.get('http://localhost:3000/');
    await browser.waitForAngularEnabled(true);
    return browser.driver.manage().window().maximize();
   }


  async showToolbarButtons() {
    const checked = await element(by.css("input[id='search-btn-toggle']")).getAttribute('checked');
    if (!checked) {
      element(by.css("label[for='download-btn-toggle']")).click();
      element(by.css("label[for='navigate-btn-toggle']")).click();
      element(by.css("label[for='print-btn-toggle']")).click();
      element(by.css("label[for='rotate-btn-toggle']")).click();
      element(by.css("label[for='search-btn-toggle']")).click();
      element(by.css("label[for='zoom-btn-toggle']")).click();
    }
  }

  getHeaderText() {
    return element(by.css('media-viewer-wrapper h2')).getText();
  }

  selectPdfViewer() {
    this.showToolbarButtons();
    element(by.id('pdf')).click();
  }

  selectImageViewer() {
    this.showToolbarButtons();
    return element(by.id('image')).click();
  }

  selectUnsupportedViewer() {
    this.showToolbarButtons();
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
