import {$$, browser, by, element, ElementFinder, Locator, protractor} from 'protractor';
import {By} from '@angular/platform-browser';
import {String} from 'typescript-string-operations';
import {GenericMethods} from '../utils/genericMethods';

const genericMethods = new GenericMethods();

const until = protractor.ExpectedConditions;

export class AppPage {

  contextToolbar: By = by.css('mv-ctx-toolbar .toolbar');
  commentButton: By = by.css('mv-ctx-toolbar button[title=\'Comment\']');
  bookmarkButton: By = by.css('#bookmarkButton');
  annotationTextArea: By = by.css('textarea.expanded');
  comments: By = by.css('textarea');
  saveButton: By = by.xpath('//button[text()=\' Save \']');
  editButton: By = by.xpath('//button[text()=\' Edit \']');
  commentDeleteButtonXpath = '//textarea[@ng-reflect-model=\'{0}\']/..//button[text()=\' Delete \']';
  page = '.page[data-page-number="{0}"]';
  bookMarkRename = protractor.By.css('.outlineWithDeepNesting .bookmarks-tree .outlineItem .bookmark__rename');
  bookMarkSave = protractor.By.css('.outlineWithDeepNesting .bookmarks-tree .bookmark__save');
  bookMarkDelete = protractor.By.css('.outlineWithDeepNesting .bookmarks-tree .bookmark__delete');
  bookMarkInput = protractor.By.css('.outlineWithDeepNesting .bookmarks-tree .node-wrapper .bookmark__input');
  bookMarkItems = protractor.By.css('.outlineWithDeepNesting .bookmarks-tree .outlineItem');
  mvIndexBtn = protractor.By.id('mvIndexBtn');
  viewBookmark = protractor.By.id('viewBookmark');

  async clickElement(selector: By) {
    const el = await element(selector);
    return el.click();
  }


  async showCustomToolbarButtons() {
    const customToolbarToggle = await element(by.id('toggleCustomToolbar'));
    const customToolbarOn = await customToolbarToggle.getAttribute('checked');
    if (!customToolbarOn) {
//       await this.clickElement(by.css('label[for="toggleCustomToolbar"]'));
      await this.clickElement(genericMethods.clickAction('label[for="toggleCustomToolbar"]'));
    }
  }

  async getHeaderText() {
    return element(by.css('a[class=\'govuk-tag govuk-tag--grey\']')).getText();
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

    await this.executeScript(x, y, 0, 0, ['mousedown', 'mouseup'], 'page', 0);
    await this.executeScript(x, y, 0, 0, ['mousedown', 'mousemove', 'mouseup'], 'shapeRectangle', 0);
  }

  async drawBoxOnPdfText(x: number, y: number) {
    await this.executeScript(x, y, 950, 950, ['mousedown', 'mousemove', 'mouseup'], 'box-highlight', 0);
  }

  async executeScript(xAxis, yAxis, screenX, screenY, eventList, elementSelector, elementIndex) {

    // tslint:disable-next-line:no-shadowed-variable
    await browser.executeScript((xAxis, yAxis, screenX, screenY, eventList, elementSelector, elementIndex) => {

      // tslint:disable-next-line:no-shadowed-variable
      const createMouseEvent = (typeArg: string, screenX: number, screenY: number, clientX: number, clientY: number) => {
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
      };

      const mouseDown = createMouseEvent('mousedown', 500, 500, 500, 500);
      const mouseMove = createMouseEvent('mousemove', screenX, screenY, xAxis, yAxis);
      const mouseUp = createMouseEvent('mouseup', 750, 800, 750, 800);

      const selectedElement = document.getElementsByClassName(elementSelector)[elementIndex];

      if (eventList.includes('mousedown')) {
        selectedElement.dispatchEvent(mouseDown);
      }
      if (eventList.includes('mousemove')) {
        selectedElement.dispatchEvent(mouseMove);
      }
      if (eventList.includes('mouseup')) {
        selectedElement.dispatchEvent(mouseUp);
      }
    }, xAxis, yAxis, screenX, screenY, eventList, elementSelector, elementIndex);
  }

  async drawOnImagePage() {
    await this.executeScript(900, 900, 750, 750, ['mousedown', 'mousemove', 'mouseup'], 'box-highlight', 0);
  }


  async highLightTextOnPdfPage() {
    await browser.executeScript(() => {

      const range = document.createRange();
      const matchingElement = document.getElementsByClassName('textLayer')[0].children[4];
      range.selectNodeContents(matchingElement);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      const mouseEvent = document.createEvent('MouseEvents');
      mouseEvent.initMouseEvent(
        'mouseup',
        true,
        true,
        window,
        1,
        844,
        497,
        937,
        403,
        false,
        false,
        false,
        false,
        0,
        null
      );

      // const mouseUp = 	mouseEvent;

      const pageHandle = document.getElementsByClassName('textLayer')[0].children[4];
      pageHandle.dispatchEvent(mouseEvent); // ('mouseup', 844,497,937,403)); //mouseUp Event

    });

  }

  //
  // async getHighlightPopUp() {
  //   await browser.executeScript(() => {
  //     const mouseDown = createMouseEvent("mousedown", 675, 405, 750, 412);
  //     const mouseMove = createMouseEvent("mousemove", 750, 450, 900, 405);
  //     const mouseUp =  createMouseEvent("mouseup", 844, 497, 937, 403);
  //     const pageHandle = document.getElementsByClassName("pdfViewer")[2];
  //
  //     pageHandle.dispatchEvent(mouseDown);
  //     pageHandle.dispatchEvent(mouseMove);
  //     pageHandle.dispatchEvent(mouseUp);
  //   });
  // }

  async clearBookmarks() {
    await browser.sleep(1000);
    await this.toggleIndexButton();
    await browser.sleep(1000);
    await element(this.viewBookmark).click();
    await browser.sleep(1000);
    await this.deleteBookmarks();
    await browser.sleep(1000);
    await this.toggleIndexButton();
  }

  async toggleIndexButton() {
    await element(this.mvIndexBtn).click();
  }

  async saveBookmarks() {
    await browser.sleep(5000);
    await element.all(this.bookMarkSave).first().click();
  }

  async getBookMarksCount() {
    await browser.sleep(1000);
    const count: number = await element.all(this.bookMarkItems).count();
    return count;
  }

  async getUpdatedBookMarkName() {
    await browser.sleep(5000);
    const name: String = await element.all(this.bookMarkItems).first().getText().trim();
    return name;
  }

  async getSaveBookMarksCount() {
    await browser.sleep(5000);
    const count: number = await element.all(this.bookMarkSave).count();
    return count;
  }

  async updateBookmarks(updatedText: string) {
    browser.sleep(1000);
    await element.all(this.bookMarkRename).first().click();
    browser.sleep(1000);
    await element.all(this.bookMarkInput).first().clear();
    browser.sleep(1000);
    await element.all(this.bookMarkInput).first().sendKeys(updatedText);
    browser.sleep(1000);
    await element.all(this.bookMarkSave).first().click();
  }

  async deleteBookmarks() {
    await browser.sleep(5000);
    // tslint:disable-next-line:triple-equals
    while (await this.getBookMarksCount() != 0) {
      $$('.outlineWithDeepNesting .bookmarks-tree .bookmark__delete').click();
    }
  }

  async createBookmarkUsingOverlay() {
    await browser.sleep(5000);
    // This is the Bookmark button on the Popup overlay.
    await element(this.bookmarkButton).click();
  }

  async showBookmarks() {
    await browser.sleep(5000);
    await element(this.mvIndexBtn).click();
    await browser.sleep(1000);
    await element(this.viewBookmark).click();
  }

  async clickOnCommentButton() {
    // await browser.waitForAngular()  // This feature did not work hence adding sleep.
    await browser.sleep(5000);
//     await genericMethods.clickAction('mv-ctx-toolbar button[title=\'Comment\']');
    await genericMethods.clickAction('mvCommentsBtn');
//     await element(this.commentButton).click();
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
    await browser.findElements(this.comments).then(async (elements) => {
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
      .then((value) => {
        if (value === 'true') {
          return true;
        }
        return false;
      });
  }

  async highLightTextForBookmarking() {

    await browser.executeScript(() => {

      const range = document.createRange();
      const matchingElement = document.getElementsByClassName('textLayer')[0].children[4];
      range.selectNodeContents(matchingElement);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);

      const mouseUpEvent = document.createEvent('MouseEvents');
      mouseUpEvent.initMouseEvent(
        'mouseup',
        true,
        true,
        window,
        1,
        844,
        497,
        937,
        403,
        false,
        false,
        false,
        false,
        0,
        null
      );

      const pageHandle = document.getElementsByClassName('textLayer')[0].children[4];
      pageHandle.dispatchEvent(mouseUpEvent); // ('mouseup', 844,497,937,403)); //mouseUp Event

    });

  }
}
