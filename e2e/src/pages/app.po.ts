import { browser, by, element, Locator, protractor } from 'protractor';
import { By } from '@angular/platform-browser';
import {el} from "@angular/platform-browser/testing/src/browser_util";
import {String, StringBuilder} from "typescript-string-operations";
const until = protractor.ExpectedConditions;

export class AppPage {


  contextToolbar: By = by.css("mv-popup-toolbar .toolbar");
  commentButton: By = by.css("mv-popup-toolbar .toolbar button[title='Comment']");
  removeHighLightButton: By = by.css("mv-popup-toolbar .toolbar button[title='Comment']");
  annotationTextArea: By = by.css("textarea");
  saveButton: By = by.xpath("//button[text()=' Save ']");
  commentDeleteButtonXpath: string = "//textarea[@ng-reflect-model='{0}']/..//button[text()=' Delete ']";

  // commentDeleteButtonXpath: string = "//textarea[@ng-reflect-model='This is comment number 1']/..//button[text()=' Delete ']";
  // allComments : string = "//textarea";


  async navigateTo() {
    await browser.driver.navigate().to(browser.baseUrl);
    return await browser.driver.manage().window().maximize();
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
        this.clickElement(by.css('label[for="zoom-btn-toggle"]')),
        this.clickElement(by.css('label[for="toggleAnnotations"]'))
      ]);
    }
  }

  async getHeaderText() {
    return await element(by.css('media-viewer-wrapper h2')).getText();
  }

  async selectPdfViewer() {
    await this.clickElement(by.id('pdf-tab'));
  }

  async selectImageViewer() {
    await this.clickElement(by.id('image-tab'));
  }

  async selectUnsupportedViewer() {
    await this.clickElement(by.id('unsupported-tab'));
  }

  async waitForPdfToLoad() {
    await browser.wait(until.presenceOf(element(by.css('div[class="page"'))), 15000, 'PDF viewer taking too long to load');
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

  async selectPDFText() {
    // const hotkeys = require('protractor-hotkeys');
    // hotkeys
    //   .trigger('mod+a');
    // await this.clickElement(by.xpath('*//div[text()=\'Abstract\']'));

  }

  async getClassAttributeOfAnElement(selector: By): Promise<string[]> {
    var splitClasses: string[] = [];
    return await element(selector).getAttribute('class').then((classes) => {
      splitClasses = classes.split(' ');
      return splitClasses;
    }).catch(() => {
      return []
    });
  }

  async highLightTextOnPdfPage() {
    await browser.executeScript(() => {
      var range = document.createRange();
      var matchingElement = document.evaluate("//div[text()='Dynamic languages such as JavaScript are more difficult to com-']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      range.selectNodeContents(matchingElement);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });

    this.getHighlightPopUp();
  }

  async getHighlightPopUp() {
    await browser.executeScript(() => {
      let mousedown = document.createEvent("Event");
      mousedown.initEvent("mousedown", true, true);
      let mouseup = document.createEvent("Event");
      mouseup.initEvent("mouseup", true, true);
      var pageHandle = document.getElementsByClassName("pdfViewer")[0];
      pageHandle.dispatchEvent(mousedown);
      pageHandle.dispatchEvent(mouseup);
    });
  }

  async clickOnCommentButton() {
    await element(this.commentButton).click();
  }

  async enterTextInAnnotation(text: string) {
    await element(this.annotationTextArea).sendKeys(text);
  }

  async clickOnSaveButton() {
    await element(this.saveButton).click();
  }

  async isContextToolBarVisible(): Promise<boolean> {
    var isVisible = false;
    await element(this.contextToolbar).isDisplayed().then((value) => {
      if (value == true) {
        isVisible = true;
        return isVisible;
      }
    }).catch(() => {
      return false
    });
    return isVisible;
  }

  async deleteTextualComment(comment: string) {
    await element(by.xpath(String.Format(this.commentDeleteButtonXpath, comment))).click();
  }

  async getAllComments() : Promise<string[]>{
    var comments : string[] = [];
    await browser.findElements(this.annotationTextArea).then( (elements) => {
      for (const element of elements) {
         element.getAttribute("ng-reflect-model").then( (a) => comments.push(a)).catch( () => {return [];});
      }
      return comments;
    } );
    return comments;
  }


}
