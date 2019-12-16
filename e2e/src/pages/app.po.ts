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
  commentDeleteButtonXpath = '//textarea[@ng-reflect-model=\'{0}\']/..//button[text()=\' Delete \']';
  page = '.page[data-page-number="{0}"]';

  async preparePage() {
    await browser.sleep(10000);
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
    await browser.wait(
      until.presenceOf(element(by.css('div[class="page"'))),
      15000,
      'PDF viewer taking too long to load'
    );
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

  async getClassAttributeOfAnElement(htmlElement: ElementFinder): Promise<string[]> {
    let splitClasses: string[] = [];
    return await htmlElement.getAttribute('class').then((classes) => {
      splitClasses = classes.split(' ');
      return splitClasses;
    }).catch(() => {
      return [];
    });
  }

  async drawOnPDFPage(x: number, y: number) {

    await browser.executeScript((xAxis, yAxis) => {
      const pageElement = document.getElementsByClassName('page')[0];

      const mouseDown = this.createMouseEvent('mousedown', 500, 500, 500, 500);
      const mouseMove = this.createMouseEvent('mousemove', 0, 0, xAxis, yAxis);
      const mouseUp = this.createMouseEvent('mouseup', 750, 800, 750, 800);

      pageElement.dispatchEvent(mouseDown);
      pageElement.dispatchEvent(mouseUp);

      const annotationElement = document.getElementsByClassName('shapeRectangle')[0];

      annotationElement.dispatchEvent(mouseDown);
      annotationElement.dispatchEvent(mouseMove);
      annotationElement.dispatchEvent(mouseUp);
    }, x, y);
  }

  async drawOnImagePage() {

    await browser.executeScript(() => {
      const imageElement = document.getElementsByTagName('mv-annotation-set')[0].childNodes[0];

      const mouseDown = this.createMouseEvent('mousedown', 500, 500, 500, 500);
      const mouseMove = this.createMouseEvent('mousemove', 750, 750, 900, 900);
      const mouseUp = this.createMouseEvent('mouseup', 750, 800, 750, 800);

      imageElement.dispatchEvent(mouseDown);
      imageElement.dispatchEvent(mouseMove);
      imageElement.dispatchEvent(mouseUp);
    });
  }

  async highLightTextOnPdfPage() {
    await browser.executeScript(() => {
      const range = document.createRange();
      const matchingElement = document.getElementsByClassName('textLayer')[0].children[4];
      range.selectNodeContents(matchingElement);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });

    this.getHighlightPopUp();
  }

  async getHighlightPopUp() {
    await browser.executeScript(() => {
      const mousedown = document.createEvent('Event');
      mousedown.initEvent('mousedown', true, true);
      const mouseup = document.createEvent('Event');
      mouseup.initEvent('mouseup', true, true);
      const pageHandle = document.getElementsByClassName('pdfViewer')[0];
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
    let isVisible = false;
    await element(this.contextToolbar).isDisplayed().then((value) => {
      if (value === true) {
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
    const comments: string[] = [];
    await browser.findElements(this.comments).then( async (elements) => {
      for (const htmlElement of elements) {
         await htmlElement.getAttribute('ng-reflect-model')
           .then((a) => comments.push(a));
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
    return await element(this.annotationTextArea)
      .getAttribute('ng-reflect-model')
      .then(a => a);
  }

  async isPageDataLoaded(pageNumber: number): Promise<boolean> {
    const cssSel = String.Format(this.page, pageNumber);
    return await element(by.css(cssSel)).getAttribute('data-loaded')
      .then( (value) => {
      if (value === 'true') {
        return true;
      }
      return false;
    });
  }

  private createMouseEvent(typeArg: string, screenX: number, screenY: number, clientX: number, clientY: number) {
    const mouseEvent = document.createEvent('MouseEvents');
    mouseEvent.initMouseEvent(
      typeArg,
      true,
      true,
      window,
      1,
      screenX,
      screenY,
      clientX,
      clientY,
      false,
      false,
      false,
      false,
      0,
      null
    );
    return mouseEvent;
  }
}
