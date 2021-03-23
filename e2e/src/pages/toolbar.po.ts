import { AppPage } from "./app.po";
import { browser, by, element, ElementFinder } from "protractor";

export class ToolBar extends AppPage {

  private sidebarToggleButton: ElementFinder = element(by.id("mvIndexBtn"));

  async openOutLineSidebar() {
    if (!(await this.isOutLineSidePanelOpen())) {
      await this.sidebarToggleButton.click();
      await browser.sleep(2000);
    }
  }

  private async isOutLineSidePanelOpen(): Promise<boolean> {
    const containerClasses = await element(by.id("outerContainer")).getAttribute("class");
    return containerClasses.includes("sidebarOpen");
  }

  async clickTextIcon() {
    await this.clickElement(by.id("mvHighlightBtn"));
  }

  async dontClickTextIcon() {
    await this.clickElement(by.id("mvHighlightBtn"));
  }

  async enableTextHighLightMode() {
    await this.toggleButton("mvHighlightBtn", false);
  }

  async disableTextHighLightMode() {
    await this.toggleButton("mvHighlightBtn", true);
  }

  async enableDrawHighLightMode() {
    await this.toggleButton("mvDrawBtn", false);
  }

  async disableDrawHighLightMode() {
    await this.toggleButton("mvDrawBtn", true);
  }

  async toggleButton(cssClass: string, toggle: boolean) {
    const cssClasses = await this.getClassAttributeOfAnElementLocator(by.id(cssClass));
    if (cssClasses.includes("toggled") === toggle) {
      await this.clickElement(by.id(cssClass));
    }
  }
}
