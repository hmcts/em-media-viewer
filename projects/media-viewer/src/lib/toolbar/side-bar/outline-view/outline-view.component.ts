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

  constructor(
    private readonly pdfJsWrapperFactory: PdfJsWrapperFactory) {
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
        this.pdfDocumentOutline.render({ outline, });
      });
    });
  }
}
