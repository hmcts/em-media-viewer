import {AppPage} from './app.po';
import {by} from 'protractor';

export class ToolBar extends AppPage {

  async clickTextIcon() {
    await this.clickElement(by.id('toggleHighlightButton'));
  }

  async dontClickTextIcon() {
    await this.clickElement(by.id('toggleHighlightButton'));
  }

}
