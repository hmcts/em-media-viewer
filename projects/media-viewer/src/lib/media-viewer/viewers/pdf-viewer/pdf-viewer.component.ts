import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import {
  RotateOperation,
  SearchOperation,
  ZoomOperation
} from '../../media-viewer.model';


@Component({
    selector: 'app-pdf-viewer',
  template: `
    <div #viewerContainer class="pdfContainer">
      <div class="pdfViewer"></div>
    </div>
  `,
    styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements AfterViewInit, OnChanges {

  @Input() url: string;
  @Input() rotateOperation: RotateOperation;
  @Input() searchOperation: SearchOperation;
  @Input() zoomOperation: ZoomOperation;

  @ViewChild('viewerContainer') viewerContainer: ElementRef;

  pdfViewer: any;
  pdfFindController: any;

  constructor(private pdfWrapper: PdfJsWrapper) {}

  ngAfterViewInit(): void {
    [this.pdfViewer, this.pdfFindController]
      = this.pdfWrapper.initViewer(this.url, this.viewerContainer);
  }


  ngOnChanges(changes: SimpleChanges): void {
    for (let change in changes) {
      let operation = changes[change].currentValue;
      if(operation && operation.action) {
        this[operation.action].call(this, operation);
      }
    }
  }

  rotate(operation: RotateOperation) {
    if (this.pdfViewer) {
      this.pdfViewer.pagesRotation = (this.pdfViewer.pagesRotation + operation.rotation) % 360;
      this.rotateOperation = this.pdfViewer.pagesRotation;
    }
  }

  zoom(operation: ZoomOperation) {
    if (this.pdfViewer) {
      this.pdfViewer.currentScale += operation.zoomFactor;
    }
  }

  search(operation: SearchOperation) {
    if (this.pdfViewer) {
      this.pdfFindController.executeCommand('findagain', {
        query: operation.searchTerm,
        highlightAll: true,
        findPrevious: operation.previous
      });
    }
  }
}
