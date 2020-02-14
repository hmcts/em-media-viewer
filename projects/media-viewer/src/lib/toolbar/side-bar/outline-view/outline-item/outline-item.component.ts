import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PdfJsWrapperFactory } from '../../../../viewers/pdf-viewer/pdf-js/pdf-js-wrapper.provider';
import * as pdfjsOutlineViewer from 'pdfjs-dist/lib/web/pdf_outline_viewer';
import { Outline } from '../outline.model';

@Component({
  selector: 'mv-outline-item',
  templateUrl: './outline-item.component.html',
  styleUrls: ['../../../../../assets/sass/toolbar/main.scss'],
})
export class OutlineItemComponent implements OnInit {

  @Input() outline: Outline;

  showOutlineItems: boolean;

  @ViewChild('outlineItem') outlineItem: ElementRef;

  constructor(private readonly pdfJsWrapperFactory: PdfJsWrapperFactory) { }

  ngOnInit() {
    this.showOutlineItems = true;
  }

  navigateLink() {
    if (this.outline.dest) {
      this.pdfJsWrapperFactory.navigateTo(this.outline.dest);
    }
  }

  toggleOutline() {
    this.showOutlineItems = !this.showOutlineItems;
  }

  getStyles() {
    const style = {
      'font-weight': '',
      'font-style': ''
    };
    if (this.outline.bold) {
      style['font-weight'] = 'bold';
    }
    if (this.outline.italic) {
      style['font-style'] = 'italic';
    }
    return style;
  }
}
