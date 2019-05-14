import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import {
  DownloadOperation,
  PrintOperation,
  RotateOperation,
  SearchOperation,
  SearchResultsCount,
  ZoomOperation
} from '../../media-viewer.model';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements AfterViewInit {

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() searchResults: Subject<SearchResultsCount>;
  @ViewChild('viewerContainer') viewerContainer: ElementRef;

  pdfViewer: any;
  pdfFindController: any;

  constructor(private pdfWrapper: PdfJsWrapper) {}

  ngAfterViewInit(): void {
    [this.pdfViewer, this.pdfFindController] = this.pdfWrapper.initViewer(this.url, this.viewerContainer);

    this.pdfFindController._eventBus.on('updatefindcontrolstate', e => {
      if (e.state === 3)  {
        this.searchResults.next(e.matchesCount);
      }
    });
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

      this.pdfFindController.executeCommand(command, {
        query: operation.searchTerm,
        caseSensitive: operation.matchCase,
        entireWord: operation.wholeWord,
        highlightAll: operation.highlightAll,
        findPrevious: operation.previous,
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
