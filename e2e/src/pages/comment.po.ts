import { browser, by, element } from 'protractor';
import { AppPage } from './app.po';

export class CommentPage extends AppPage {

  async openComments() {
    await this.waitForElement(by.id('toggleCommentSummary'));
    const toggleCommentSummaryElement = element(by.id('toggleCommentSummary'));
    if (!toggleCommentSummaryElement.getAttribute('checked')) {
        toggleCommentSummaryElement.click();
    }
  }

  async getModal() {
    await this.waitForElement(by.id('modal'));
    return element(by.id('modal'));
  }

  async closeModal() {
    await this.waitForElement(by.id('modal-close-button'));
    return element(by.id('modal-close-button')).click();
  }

  async clickOutsideModal() {
    await this.waitForElement(by.id('modal-background'));
    return element(by.id('modal-background')).click();
  }

  async getCommentContainer() {
    await this.waitForElement(by.id('comment-container'));
    return element(by.id('comment-container'));
  }

  async getFirstComment() {
    await this.waitForElement(by.id('comment-row-0'));
    return element(by.id('comment-row-0'));
  }

  async getSecondComment() {
    await this.waitForElement(by.id('comment-row-1'));
    return element(by.id('comment-row-1'));
  }

  async clickLastComment() {
    await this.waitForElement(by.id('comment-row-3'));
    return element(by.id('comment-row-1')).click();
  }

  async number() {
    await this.waitForElement(by.id('pageNumber'));
    return element(by.id('pageNumber')).getAttribute('value');
  }

}
