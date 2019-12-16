import {browser, by, element} from 'protractor';
import {AppPage} from './app.po';
import {String} from 'typescript-string-operations';

export class OutlinePage extends AppPage {

  nodeToggleXpath = '//div[@class="outlineItem"]//a[text()="{0}"]/../div[contains(@class,"outlineItemToggler")]';
  nodeLinkXpath = '//div[@class="outlineItem"]//a[text()="{0}"]/../div[@class="outlineItems"]//a[text()="{1}"]';

  async expandOutlineNode(nodeText: string) {
    nodeText = this.transformNodeText(nodeText);
    const nodeFullXpath = String.Format(this.nodeToggleXpath, nodeText);

    await browser.executeScript( (script) => {
      const nodeArrow: Element = <Element> document
        .evaluate(script, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue;

      if (nodeArrow.classList.contains('outlineItemsHidden')) {
        const evt = document.createEvent('HTMLEvents');
        evt.initEvent('click', false, true);
        nodeArrow.dispatchEvent(evt);
      }
    }, nodeFullXpath);
  }

  async collapseOutlineNode(nodeText: string) {
    const nodeFullXpath = String.Format(this.nodeToggleXpath, nodeText);
    const nodeArrow: Element = <Element> await document
      .evaluate(nodeFullXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
      .singleNodeValue;

    if (!nodeArrow.classList.contains('outlineItemsHidden')) {
      const evt = document.createEvent('HTMLEvents');
      evt.initEvent('click', false, true);
      nodeArrow.dispatchEvent(evt);
    }
  }

  async clickOnLink(parentNodeText: string, nodeText: string) {
    nodeText = this.transformNodeText(nodeText);
    parentNodeText = this.transformNodeText(parentNodeText);
    const nodeLinkFullXpath = String.Format(this.nodeLinkXpath, parentNodeText, nodeText);
    await element(by.xpath(nodeLinkFullXpath)).click();
  }

  async navigateToLink(linkChain: string) {
    const splitLink = linkChain.split(`>`).reverse();
    let node = '';
    for (let i = 0; i < splitLink.length; i++) {
      node = splitLink.pop();
      await this.expandOutlineNode(node);
    }
    await this.clickOnLink(node, splitLink.pop());
  }

  private transformNodeText(text: string): string {
    text = text.trim();
    text = ' ' + text + ' ';
    return text;
  }
}
