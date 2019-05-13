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
  set rotateOperation(operation: RotateOperation | null) {
    if (this.pdfViewer && operation) {
      this.pdfViewer.pagesRotation = (this.pdfViewer.pagesRotation + operation.rotation) % 360;
      this.rotateOperation = this.pdfViewer.pagesRotation;
    }
  }

  @Input()
  set zoomOperation(operation: ZoomOperation | null) {
    if (this.pdfViewer && operation) {
      this.pdfViewer.currentScale += operation.zoomFactor;
    }
  }

  @Input()
  set searchOperation(operation: SearchOperation | null) {
    if (this.pdfViewer && operation) {
      const command = operation.reset ? 'find' : 'findagain';
      console.log(command);
      this.pdfFindController.executeCommand(command, {
        query: operation.searchTerm,
        highlightAll: true,
        findPrevious: operation.previous
      });
    }
  }

  @Input()
  set printOperation(operation: PrintOperation | null) {
    if (operation) {
      const printWindow = window.open(this.url);
      printWindow.print();
    }
  }

  @Input()
  set downloadOperation(operation: DownloadOperation | null) {
    if (operation) {
      this.pdfWrapper.downloadFile(this.url, this.downloadFileName);
    }
  }
}
