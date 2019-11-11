import { AppPage } from './app.po';
import { browser, by, element, ElementFinder } from 'protractor';

export class ToolBar extends AppPage {

  private outLineButton: ElementFinder = element(by.id('viewOutline'));

  async openOutLineSidebar() {
    if (!(await this.isOutLineSidePanelOpen())) {
      await this.outLineButton.click();
      await browser.sleep(2000);
    }
  }

  private async isOutLineSidePanelOpen(): Promise<boolean> {
    return (await this.getClassAttributeOfAnElementLocator(by.id('outerContainer')))
      .includes('sidebarOpen');
  }

  async clickTextIcon() {
    await this.clickElement(by.id('toggleHighlightButton'));
  }

  async dontClickTextIcon() {
    await this.clickElement(by.id('toggleHighlightButton'));
  }

  async enableTextHighLightMode() {
    await this.toggleButton('toggleHighlightButton', false);
  }

  async disableTextHighLightMode() {
    await this.toggleButton('toggleHighlightButton', true);
  }

  async enableDrawHighLightMode() {
    await this.toggleButton('toggleDrawButton', false);
  }

  async disableDrawHighLightMode() {
    await this.toggleButton('toggleDrawButton', true);
  }

  async toggleButton(cssClass: string, toggle: boolean) {
    const cssClasses = await this.getClassAttributeOfAnElementLocator(by.id(cssClass));
    if (cssClasses.includes('toggled') === toggle) {
      await this.clickElement(by.id(cssClass));
    }
  }
}
