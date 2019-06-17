import { browser, by, element, Locator, protractor } from 'protractor';
import { By } from '@angular/platform-browser';
const until = protractor.ExpectedConditions;

export class AppPage {

  async navigateTo() {
    const homepage = await browser.get('/');
    return homepage;
  }

  async preparePage() {
    await this.navigateTo();
    await this.showToolbarButtons();
  }

  async clickElement(selector: By) {
    const el = await element(selector);
    return el.click();
  }

  async showToolbarButtons() {
    const searchButtonElement = await element(by.id('search-btn-toggle'));
    const checked = await searchButtonElement.getAttribute('checked');
    if (!checked) {
      await Promise.all([
        this.clickElement(by.css('label[for="download-btn-toggle"]')),
        this.clickElement(by.css('label[for="navigate-btn-toggle"]')),
        this.clickElement(by.css('label[for="print-btn-toggle"]')),
        this.clickElement(by.css('label[for="rotate-btn-toggle"]')),
        this.clickElement(by.css('label[for="search-btn-toggle"]')),
        this.clickElement(by.css('label[for="zoom-btn-toggle"]'))
      ]);
    }
  }

  async getHeaderText() {
    const headerText = await element(by.css('media-viewer-wrapper h2')).getText();
    return headerText;
  }

  async selectPdfViewer() { await this.clickElement(by.id('pdf')); }

  async selectImageViewer() { await this.clickElement(by.id('image')); }

  async selectUnsupportedViewer() { await this.clickElement(by.id('unsupported')); }

  async waitForPdfToLoad() {
    await browser.wait(until.presenceOf(element(by.css('div[class="page"'))), 3000, 'PDF viewer taking too long to load');
  }

  async waitForElement(selector: Locator) {
    await browser.wait(async () => {
      return (await element(selector)).isPresent();
    }, 10000, 'failed to load search results');
  }

  async waitForElementsArray(selector: Locator) {
    await browser.wait(async () => {
      return (await element.all(selector).isPresent());
    }, 10000, 'failed to load search results');
  }
}
