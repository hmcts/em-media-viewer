import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import {
  DownloadOperation,
  PrintOperation,
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
export class PdfViewerComponent implements AfterViewInit {

  @Input() url: string;
  @Input() downloadFileName: string;
  @ViewChild('viewerContainer') viewerContainer: ElementRef;

  pdfViewer: any;
  pdfFindController: any;

  constructor(private pdfWrapper: PdfJsWrapper) {}

  ngAfterViewInit(): void {
    [this.pdfViewer, this.pdfFindController]
      = this.pdfWrapper.initViewer(this.url, this.viewerContainer);
  }


  @Input()
  set rotateOperation(operation: RotateOperation) {
    if (this.pdfViewer && operation) {
      this.pdfViewer.pagesRotation = (this.pdfViewer.pagesRotation + operation.rotation) % 360;
      this.rotateOperation = this.pdfViewer.pagesRotation;
    }
  }

  @Input()
  set zoomOperation(operation: ZoomOperation) {
    if (this.pdfViewer && operation) {
      this.pdfViewer.currentScale += operation.zoomFactor;
    }
  }

  @Input()
  set searchOperation(operation: SearchOperation) {
    if (this.pdfViewer && operation) {
      this.pdfFindController.executeCommand('findagain', {
        query: operation.searchTerm,
        highlightAll: true,
        findPrevious: operation.previous
      });
    }
  }

  @Input()
  set printOperation(printOperation: PrintOperation) {
    if (printOperation) {
      const printWindow = window.open(this.url);
      printWindow.print();
    }
  }

  @Input()
  set downloadOperation(downloadOperation: DownloadOperation) {
    if (downloadOperation) {
      this.pdfWrapper.downloadFile(this.url, this.downloadFileName);
    }
  }
}
