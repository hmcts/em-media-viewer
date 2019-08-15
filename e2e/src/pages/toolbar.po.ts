import {AppPage} from './app.po';
import {by} from 'protractor';

export class ToolBar extends AppPage {

  async clickTextIcon() {
    await this.clickElement(by.id('toggleHighlightButton'));
  }

  async dontClickTextIcon() {
    await this.clickElement(by.id('toggleHighlightButton'));
  }

  async enableTextHighLightMode(){
        if(!(await this.getClassAttributeOfAnElement(by.id('toggleHighlightButton')).then( (classes) => classes.includes('toggled')))) {
            await this.clickElement(by.id('toggleHighlightButton'));
          }
      }

  async disableTextHighLightMode(){
        if(await this.getClassAttributeOfAnElement(by.id('toggleHighlightButton')).then( (classes) => classes.includes('toggled'))){
            await this.clickElement(by.id('toggleHighlightButton'));
          }else {
          }
      }

  async enableDrawHighLightMode(){
        if(!(await this.getClassAttributeOfAnElement(by.id('toggleDrawButton')).then( (classes) => classes.includes('toggled')))) {
            await this.clickElement(by.id('toggleDrawButton'));
          }
      }

  async disableDrawHighLightMode(){
        if(await this.getClassAttributeOfAnElement(by.id('toggleDrawButton')).then( (classes) => classes.includes('toggled'))){
            await this.clickElement(by.id('toggleDrawButton'));
          }else {
          }
      }
}
