import {AppPage} from './app.po';
import {browser, by, element, ElementFinder} from 'protractor';

export class ToolBar extends AppPage {

  private outLineButton:ElementFinder = element(by.id('viewOutline'));

  async openOutLineSidebar() {
    if(!(await this.isOutLineSidePanelOpen())){
      await this.outLineButton.click();
      await browser.sleep(2000);
    }
  }

  private async isOutLineSidePanelOpen(): Promise<boolean> {
    return await this.getClassAttributeOfAnElementLocator(by.id('outerContainer')).then((classes) => {
      return classes.includes('sidebarOpen');
    });
  }

  async clickTextIcon() {
    await this.clickElement(by.id('toggleHighlightButton'));
  }

  async dontClickTextIcon() {
    await this.clickElement(by.id('toggleHighlightButton'));
  }

  async enableTextHighLightMode(){
        if(!(await this.getClassAttributeOfAnElementLocator(by.id('toggleHighlightButton')).then( (classes) => classes.includes('toggled')))) {
            await this.clickElement(by.id('toggleHighlightButton'));
          }
      }

  async disableTextHighLightMode(){
        if(await this.getClassAttributeOfAnElementLocator(by.id('toggleHighlightButton')).then( (classes) => classes.includes('toggled'))){
            await this.clickElement(by.id('toggleHighlightButton'));
          }else {
          }
      }

  async enableDrawHighLightMode(){
        if(!(await this.getClassAttributeOfAnElementLocator(by.id('toggleDrawButton')).then( (classes) => classes.includes('toggled')))) {
            await this.clickElement(by.id('toggleDrawButton'));
          }
      }

  async disableDrawHighLightMode(){
        if(await this.getClassAttributeOfAnElementLocator(by.id('toggleDrawButton')).then( (classes) => classes.includes('toggled'))){
            await this.clickElement(by.id('toggleDrawButton'));
          }else {
          }
      }
}
