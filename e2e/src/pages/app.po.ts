import {browser, by, element, ElementFinder, Locator, protractor, WebElement} from 'protractor';
import {By} from '@angular/platform-browser';
import {String} from 'typescript-string-operations';

const until = protractor.ExpectedConditions;

export class AppPage {

  contextToolbar: By = by.css('mv-popup-toolbar .toolbar');
  commentButton: By = by.css('mv-popup-toolbar .toolbar button[title=\'Comment\']');
  removeHighLightButton: By = by.css('mv-popup-toolbar .toolbar button[title=\'Comment\']');
  annotationTextArea: By = by.css('textarea.expanded');
  comments: By = by.css('textarea');
  saveButton: By = by.xpath('//button[text()=\' Save \']');
  editButton: By = by.xpath('//button[text()=\' Edit \']');
  commentDeleteButtonXpath: string = '//textarea[@ng-reflect-model=\'{0}\']/..//button[text()=\' Delete \']';
  page: string = '.page[data-page-number="{0}"]';

  async preparePage() {
    await browser.sleep(5000);
    await this.showToolbarButtons();
  }

  async clickElement(selector: By) {
    const el = await element(selector);
    return el.click();
  }

  async showToolbarButtons() {
    const searchButtonElement = await element(by.css('label[for="search-btn-toggle"]'));
    const checked = await searchButtonElement.getAttribute('checked');
    if (!checked) {
      await Promise.all([
        this.clickElement(by.css('label[for="download-btn-toggle"]')),
        this.clickElement(by.css('label[for="navigate-btn-toggle"]')),
        this.clickElement(by.css('label[for="print-btn-toggle"]')),
        this.clickElement(by.css('label[for="rotate-btn-toggle"]')),
        this.clickElement(by.css('label[for="search-btn-toggle"]')),
        this.clickElement(by.css('label[for="zoom-btn-toggle"]')),
      ]);
    }
    const annotationsToggle = await element(by.id('toggleAnnotations'));
    const annotationsON = await annotationsToggle.getAttribute('checked');
    if (!annotationsON) {
      await this.clickElement(by.css('label[for="toggleAnnotations"]'));
    }

  }

  async showCustomToolbarButtons() {
    const customToolbarToggle = await element(by.id('toggleCustomToolbar'));
    const customToolbarOn = await customToolbarToggle.getAttribute('checked');
    if (!customToolbarOn) {
      await this.clickElement(by.css('label[for="toggleCustomToolbar"]'));
    }
  }

  async getHeaderText() {
    return await element(by.css('media-viewer-wrapper h2')).getText();
  }

  async selectPdfViewer() {
    await this.clickElement(by.id('pdf-button'));
  }

  async selectImageViewer() {
    await this.clickElement(by.id('image-button'));
  }

  async selectUnsupportedViewer() {
    await this.clickElement(by.id('unsupported-button'));
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

  async getClassAttributeOfAnElementLocator(selector: By): Promise<string[]> {
    return await this.getClassAttributeOfAnElement(element(selector));
  }

  async getClassAttributeOfAnElement(element: ElementFinder): Promise<string[]> {
    var splitClasses: string[] = [];
    return await element.getAttribute('class').then((classes) => {
      splitClasses = classes.split(' ');
      return splitClasses;
    }).catch(() => {
      return [];
    });
  }

  async drawOnPDFPage(xAxis: number, yAxis: number) {
    await browser.executeScript((xAxis, yAxis) => {
      let pageElement = document.getElementsByClassName('page')[0];

      let mouseDownEvent = document.createEvent('MouseEvents');
      let mouseMoveEvent = document.createEvent('MouseEvents');
      let mouseUpEvent = document.createEvent('MouseEvents');

      mouseDownEvent.initMouseEvent('mousedown', true, true, window, 1, 500, 500, 500, 500, false, false, false, false, 0, null);
      mouseMoveEvent.initMouseEvent('mousemove', true, true, window, 1, 0, 0, xAxis, yAxis, false, false, false, false, 0, null);
      mouseUpEvent.initMouseEvent('mouseup', true, true, window, 1, 750, 800, 750, 800, false, false, false, false, 0, null);

      pageElement.dispatchEvent(mouseDownEvent);
      pageElement.dispatchEvent(mouseUpEvent);

      let annotationElement = document.getElementsByClassName('shapeRectangle')[0];

      annotationElement.dispatchEvent(mouseDownEvent);
      annotationElement.dispatchEvent(mouseMoveEvent);
      annotationElement.dispatchEvent(mouseUpEvent);
    },xAxis,yAxis);
  }

  async drawOnImagePage() {

    await browser.executeScript(() => {
      let imageElement = document.getElementsByTagName('mv-annotation-set')[0].childNodes[0];

      let mouseDownEvent = document.createEvent('MouseEvents');
      let mouseMoveEvent = document.createEvent('MouseEvents');
      let mouseUpEvent = document.createEvent('MouseEvents');


      mouseDownEvent.initMouseEvent('mousedown', true, true, window, 1, 500, 500, 500, 500, false, false, false, false, 0, null);
      mouseMoveEvent.initMouseEvent('mousemove', true, true, window, 1, 750, 750, 900, 900, false, false, false, false, 0, null);
      mouseUpEvent.initMouseEvent('mouseup', true, true, window, 1, 750, 800, 750, 800, false, false, false, false, 0, null);

      imageElement.dispatchEvent(mouseDownEvent);
      imageElement.dispatchEvent(mouseMoveEvent);
      imageElement.dispatchEvent(mouseUpEvent);
    });

  }

  async highLightTextOnPdfPage() {
    await browser.executeScript(() => {
      var range = document.createRange();
      var matchingElement = document.getElementsByClassName('textLayer')[0].children[4];
      range.selectNodeContents(matchingElement);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });

    this.getHighlightPopUp();
  }

  async getHighlightPopUp() {
    await browser.executeScript(() => {
      let mousedown = document.createEvent('Event');
      mousedown.initEvent('mousedown', true, true);
      let mouseup = document.createEvent('Event');
      mouseup.initEvent('mouseup', true, true);
      var pageHandle = document.getElementsByClassName('pdfViewer')[0];
      pageHandle.dispatchEvent(mousedown);
      pageHandle.dispatchEvent(mouseup);
    });
  }


  async clickOnCommentButton() {
    // await browser.waitForAngular()  // This feature did not work hence adding sleep.
    await browser.sleep(5000);
    await element(this.commentButton).click();
  }

  async enterTextInAnnotation(text: string) {
    await element(this.annotationTextArea).sendKeys(text);
  }

  async clickOnSaveButton() {
    await element(this.saveButton).click();
  }

  async clickOnEditButton() {
    await element(this.editButton).click();
  }

  async isContextToolBarVisible(): Promise<boolean> {
    var isVisible = false;
    await element(this.contextToolbar).isDisplayed().then((value) => {
      if (value == true) {
        isVisible = true;
        return isVisible;
      }
    }).catch(() => {
      return false;
    });
    return isVisible;
  }

  async deleteComment(comment: string) {
    await element(by.xpath(String.Format(this.commentDeleteButtonXpath, comment))).click();
  }

  async getAllComments(): Promise<string[]> {
    let comments: string[] = [];
    await browser.findElements(this.comments).then( async (elements) => {
      for (const element of elements) {
         await element.getAttribute('ng-reflect-model').then((a) => comments.push(a));
      }
      return comments;
    });
    return comments;
  }

  async updateComment(comment: string, newComment: string) {
    await this.clickOnEditButton();
    await element(this.annotationTextArea).clear();
    await element(this.annotationTextArea).sendKeys(newComment);
    await this.clickOnSaveButton();
  }

  async getComment(): Promise<string> {
    return await element(this.annotationTextArea).getAttribute('ng-reflect-model').then((a) => {
      return a;
    });
  }

  async isPageDataLoaded(pageNumber: number): Promise<boolean> {
    let cssSel = String.Format(this.page, pageNumber);
    return await element(by.css(cssSel)).getAttribute('data-loaded').then( (value) =>{
      if(value == 'true') {
        return true;
      }
      return false;
    });
  }

}
