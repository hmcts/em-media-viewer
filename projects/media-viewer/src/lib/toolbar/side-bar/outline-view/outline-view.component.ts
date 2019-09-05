import * as pdfjsLib from 'pdfjs-dist';
import * as pdfjsOutlineViewer from 'pdfjs-dist/lib/web/pdf_outline_viewer';
import {
  AfterContentInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { PdfJsWrapperFactory } from '../../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper.provider';

@Component({
  selector: 'mv-outline-view',
  templateUrl: './outline-view.component.html',
  styleUrls: ['../../../styles/main.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OutlineViewComponent implements OnChanges, AfterContentInit {

  @Input() url: string;
  @ViewChild('outlineContainer') outlineContainer: ElementRef;

  private pdfDocumentOutline: pdfjsOutlineViewer.PDFOutlineViewer;
  private outline: {};

  constructor(private readonly pdfJsWrapperFactory: PdfJsWrapperFactory) {
  }

  async ngAfterContentInit() {
    this.renderOutlineView();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.url) {
      this.outline = {};
      await this.renderOutlineView();
    }
  }

  async renderOutlineView() {
    this.pdfDocumentOutline = this.pdfJsWrapperFactory.createDocumentOutline(this.outlineContainer);
    const pdf = await pdfjsLib.getDocument({
      url: this.url,
      cMapUrl: 'assets/minified/cmaps',
      cMapPacked: true,
      withCredentials: true
    });

    this.outline = await pdf.getOutline();
    this.render({ outline: this.outline });
  }

  bindOutlineLink(element, { url, newWindow, dest }) {
    const linkService = this.pdfDocumentOutline.linkService;

    element.href = linkService.getDestinationHash(dest);
    element.onclick = () => {
      if (dest) {
        linkService.navigateTo(dest);
      }
      return false;
    };
  }

  setStyles(element, { bold, italic }) {
    let styleStr = '';
    if (bold) {
      styleStr += 'font-weight: bold;';
    }
    if (italic) {
      styleStr += 'font-style: italic;';
    }
    if (styleStr) {
      element.setAttribute('style', styleStr);
    }
  }

  addToggleButton(div, { count, items, }) {
    const toggler = document.createElement('div');
    toggler.className = 'outlineItemToggler outlineItemsHidden';

    toggler.onclick = (evt) => {
      evt.stopPropagation();
      toggler.classList.toggle('outlineItemsHidden');
    };

    div.insertBefore(toggler, div.firstChild);
  }

  resetOutline() {
    let firstNode = this.outlineContainer.nativeElement.firstElementChild;
    while (firstNode) {
      this.outlineContainer.nativeElement.removeChild(firstNode);
      firstNode = this.outlineContainer.nativeElement.firstElementChild;
    }
  }

  render({ outline, }) {
    let outlineCount = 0;

    if (this.outline) {
      this.resetOutline();
    }
    this.outline = outline || null;

    const fragment = document.createDocumentFragment();
    const queue = [{ parent: fragment, items: this.outline, }];
    let hasAnyNesting = false;
    while (queue.length > 0) {
      const levelData = queue.shift();
      for (const item in levelData.items) {
        const div = document.createElement('div');
        div.className = 'outlineItem';

        const element = document.createElement('a');
        this.bindOutlineLink(element, levelData.items[item]);
        this.setStyles(element, levelData.items[item]);
        element.textContent = pdfjsLib.removeNullCharacters(levelData.items[item].title) || 'outline ' + outlineCount + 1;

        div.appendChild(element);

        if (levelData.items[item].items.length > 0) {
          hasAnyNesting = true;
          this.addToggleButton(div, levelData.items[item]);

          const itemsDiv = document.createElement('div');
          itemsDiv.className = 'outlineItems';
          div.appendChild(itemsDiv);
          queue.push({ parent: <DocumentFragment><unknown>itemsDiv, items: levelData.items[item].items, });
        }
        levelData.parent.appendChild(div);
        outlineCount++;
      }
    }
    if (hasAnyNesting) {
      this.outlineContainer.nativeElement.classList.add('outlineWithDeepNesting');
      this.pdfDocumentOutline.lastToggleIsShow =
        (fragment.querySelectorAll('.outlineItemsHidden').length === 0);
    }
    this.outlineContainer.nativeElement.appendChild(fragment);
  }
}
