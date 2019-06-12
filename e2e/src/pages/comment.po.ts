import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';

export class CommentPage extends AppPage {

  async openModal() {
    const checked = await element(by.css('input[id="toggleCommentSummary"]')).getAttribute('checked');
    console.log('JJJ - before openModal, checked is ', checked);
    if (!checked) {
      element(by.css('label[for="toggleCommentSummary"]')).click();
    }
  }

  async closeModal() {
    const checked = await element(by.css('input[id="toggleCommentSummary"]')).getAttribute('checked');
    console.log('JJJ - before closeModal, checked is ', checked);
    if (checked) {
      element(by.css('label[for="toggleCommentSummary"]')).click();
    }
  }

  async getModal() {
    await this.waitForElement(by.id('modal'));
    return element(by.id('modal'));
  }

  async getCommentContainer() {
    console.log(await element(by.id('comment-container')).getText()); // This is working!
    return await element(by.id('comment-container'));
  }

  // async clickOutsideModal() {
  //   await this.waitForElement(by.id('modal-background'));
  //   return element(by.id('modal-background')).click();
  // }

  // async getFirstComment() {
  //   await this.waitForElement(by.id('comment-row-0'));
  //   return element(by.id('comment-row-0'));
  // }

  // async getSecondComment() {
  //   await this.waitForElement(by.id('comment-row-1'));
  //   return element(by.id('comment-row-1'));
  // }

  // async clickLastComment() {
  //   await this.waitForElement(by.id('comment-row-3'));
  //   return element(by.id('comment-row-1')).click();
  // }

  async number() {
    await this.waitForElement(by.id('pageNumber'));
    return element(by.id('pageNumber')).getAttribute('value');
  }

}
