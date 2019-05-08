import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import {
  RotateDirection,
  RotateOperation,
  SearchOperation,
  ZoomOperation
} from '../../service/media-viewer-message.model';


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
    if (changes.rotateOperation) {
      this.rotate(this.rotateOperation);
    }
    if (changes.searchOperation) {
      this.search(this.searchOperation);
    }
    if (changes.zoomOperation) {
      this.zoom(this.zoomOperation);
    }
  }

  rotate(rotateDirection: RotateOperation) {
    if (this.pdfViewer) {
      let currentRotation = this.pdfViewer.pagesRotation;
      if (rotateDirection.direction === RotateDirection.LEFT) {
        currentRotation = (currentRotation - 90) % 360;
      } else if (rotateDirection.direction === RotateDirection.RIGHT) {
        currentRotation = (currentRotation + 90) % 360;
      }
      this.pdfViewer.pagesRotation = currentRotation;
    }
  }

  zoom(zoomOperation: ZoomOperation) {
    if (this.pdfViewer) {
      this.pdfViewer.currentScale += zoomOperation.zoomFactor;
    }
  }

  search(searchOperation: SearchOperation) {
    if (this.pdfViewer) {
      this.pdfFindController.executeCommand('findagain', {
        query: searchOperation.searchTerm,
        highlightAll: true,
        findPrevious: searchOperation.previous});
    }
  }
}
