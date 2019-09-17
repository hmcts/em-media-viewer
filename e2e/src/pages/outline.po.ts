import {browser, by, element} from 'protractor';
import {AppPage} from './app.po';
import {String} from 'typescript-string-operations';

export class OutlinePage extends AppPage {

  nodeToggleXpath: string = '//div[@class="outlineItem"]//a[text()="{0}"]/../div[contains(@class,"outlineItemToggler")]';
  nodeLinkXpath: string = '//div[@class="outlineItem"]//a[text()="{0}"]/../div[@class="outlineItems"]//a[text()="{1}"]';

  async expandOutlineNode(nodeText: string){
    nodeText = this.transformNodeText(nodeText);
    let nodeFullXpath = String.Format(this.nodeToggleXpath, nodeText);

    await browser.executeScript( (nodeFullXpath)=> {
      let nodeArrow:Element = <Element> document.evaluate(nodeFullXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if(nodeArrow.classList.contains('outlineItemsHidden')) {
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", false, true);
        nodeArrow.dispatchEvent(evt);
      }
    }, nodeFullXpath);
  }

  async collapseOutlineNode(nodeText: string){
    let nodeFullXpath = String.Format(this.nodeToggleXpath, nodeText);
    let nodeArrow:Element = <Element> await document.evaluate(nodeFullXpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    if(!nodeArrow.classList.contains('outlineItemsHidden')) {
      let evt = document.createEvent("HTMLEvents");
      evt.initEvent("click", false, true);
      nodeArrow.dispatchEvent(evt);
    }
  }

  async clickOnLink(parentNodeText: string, nodeText: string){
    nodeText = this.transformNodeText(nodeText);
    parentNodeText = this.transformNodeText(parentNodeText);
    let nodeLinkFullXpath = String.Format(this.nodeLinkXpath, parentNodeText, nodeText);
    await element(by.xpath(nodeLinkFullXpath)).click();
  }

  async navigateToLink(linkChain: string) {
    let splitLink = linkChain.split(`>`).reverse();
    let node: string ='';
    for(let i = 0; i < splitLink.length; i++){
      node = splitLink.pop();
      await this.expandOutlineNode(node);
    }
    await this.clickOnLink(node, splitLink.pop());
  }

  private transformNodeText(text:string): string{
    text = text.trim();
    text =' ' + text + ' ';
    return text;
  }
}
