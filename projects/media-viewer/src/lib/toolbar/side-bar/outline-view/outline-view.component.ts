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
    if (changes.url && this.pdfDocumentOutline) {
      await this.renderOutlineView();
    }
  }

  renderOutlineView() {
    this.pdfDocumentOutline = this.pdfJsWrapperFactory.createDocumentOutline(this.outlineContainer);
    const loadingTask = pdfjsLib.getDocument({
      url: this.url,
      cMapUrl: 'assets/minified/cmaps',
      cMapPacked: true,
      withCredentials: true
    });

    loadingTask.then(pdf => {
      pdf.getOutline().then((outline) => {
        this.outline = outline;
        this.render({outline: this.outline, });
      });
    });
  }

  _dispatchEvent(outlineCount) {
    this.pdfDocumentOutline.eventBus.dispatch('outlineloaded', {
      source: this,
      outlineCount,
    });
  }

  _bindLink(element, { url, newWindow, dest, }) {
    const linkService = this.pdfDocumentOutline.linkService;
    if (url) {
      pdfjsLib.addLinkAttributes(element, {
        url,
        target: (newWindow ? pdfjsLib.LinkTarget.BLANK : linkService.externalLinkTarget),
        rel: linkService.externalLinkRel,
        enabled: linkService.externalLinkEnabled,
      });
      return;
    }

    element.href = linkService.getDestinationHash(dest);
    element.onclick = () => {
      if (dest) {
        linkService.navigateTo(dest);
      }
      return false;
    };
  }

  _setStyles(element, { bold, italic, }) {
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

  _addToggleButton(div, { count, items, }) {
    const toggler = document.createElement('div');
    toggler.className = 'outlineItemToggler outlineItemsHidden';
    if (count < 0 && Math.abs(count) === items.length) {
      toggler.classList.add('outlineItemsHidden');
    }
    toggler.onclick = (evt) => {
      evt.stopPropagation();
      toggler.classList.toggle('outlineItemsHidden');

      if (evt.shiftKey) {
        const shouldShowAll = !toggler.classList.contains('outlineItemsHidden');
        this._toggleOutlineItem(div, shouldShowAll);
      }
    };
    div.insertBefore(toggler, div.firstChild);
  }

  _toggleOutlineItem(root, show = false) {
    this.pdfDocumentOutline.lastToggleIsShow = show;
    for (const toggler of root.querySelectorAll('.outlineItemToggler')) {
      toggler.classList.toggle('outlineItemsHidden', !show);
    }
  }

  render({ outline, }) {
    const DEFAULT_TITLE = '\u2013';
    let outlineCount = 0;

    if (this.outline) {
      this.pdfDocumentOutline.reset();
    }
    this.outline = outline || null;

    if (!outline) {
      this._dispatchEvent(outlineCount);
      return;
    }

    const fragment = document.createDocumentFragment();
    const queue = [{ parent: fragment, items: this.outline, }];
    let hasAnyNesting = false;
    while (queue.length > 0) {
      const levelData = queue.shift();
      for (const item in levelData.items) {
        const div = document.createElement('div');
        div.className = 'outlineItem';

        const element = document.createElement('a');
        this._bindLink(element, levelData.items[item]);
        this._setStyles(element, levelData.items[item]);
        element.textContent = pdfjsLib.removeNullCharacters(levelData.items[item].title) || DEFAULT_TITLE;

        div.appendChild(element);

        if (levelData.items[item].items.length > 0) {
          hasAnyNesting = true;
          this._addToggleButton(div, levelData.items[item]);

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
      this.pdfDocumentOutline.container.classList.add('outlineWithDeepNesting');
      this.pdfDocumentOutline.lastToggleIsShow =
        (fragment.querySelectorAll('.outlineItemsHidden').length === 0);
    }
    this.pdfDocumentOutline.container.appendChild(fragment);
    this._dispatchEvent(outlineCount);
  }
}
