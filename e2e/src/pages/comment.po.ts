import { by, element } from 'protractor';
import { AppPage } from './app.po';
import {By} from '@angular/platform-browser';

export class CommentPage extends AppPage {
  commentBox: By = by.xpath('//form[@class=\'aui-comment rotation rot0 ng-dirty ng-valid ng-touched\']//textarea[@name=\'content\']');

  async openModal() {
    const el = await element(by.css('input[id="toggleCommentSummary"]'));
    const checked = await el.getAttribute('checked');
    if (!checked) {
      await this.clickElement(by.css('label[for="toggleCommentSummary"]'));
    }
  }

  async getModal() {
    await this.waitForElement(by.id('modal'));
    return (await element(by.id('modal')));
  }

  async getModalText() {
    await this.waitForElement(by.id('modal'));
    const modalText = await (await element(by.id('modal'))).getText();
    return modalText;
  }

  async modalIsOpen() {
    return (await element(by.id('modal'))).isPresent();
  }

  async clickCloseButton() {
    await this.clickElement(by.id('modal-close-button'));
  }

}
