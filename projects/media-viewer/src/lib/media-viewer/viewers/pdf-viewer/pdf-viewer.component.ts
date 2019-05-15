import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import {
  ChangePageByDeltaOperation,
  DownloadOperation,
  PrintOperation,
  RotateOperation,
  SearchOperation,
  SearchResultsCount, SetCurrentPageOperation,
  ZoomOperation
} from '../../media-viewer.model';
import {Subject} from 'rxjs';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import {PrintService} from '../../print.service';

@Component({
  selector: 'mv-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements AfterViewInit {

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() searchResults: Subject<SearchResultsCount>;
  @ViewChild('viewerContainer') viewerContainer: ElementRef;
  @Input() stateChange: Subject<any>;

  pdfViewer: pdfjsViewer.PDFViewer;
  pdfFindController: pdfjsViewer.PDFFindController;

  constructor(private pdfWrapper: PdfJsWrapper, private printService: PrintService) {}

  async ngAfterViewInit(): Promise<void> {
    [this.pdfViewer, this.pdfFindController] = await this.pdfWrapper.initViewer(this.url, this.viewerContainer);

    this.pdfViewer.eventBus.on('updatefindcontrolstate', e => {
      if (e.state === FindState.NOT_FOUND) {
        this.searchResults.next({ current: 0, total: 0 });
      }
    });
    this.pdfViewer.eventBus.on('updatefindmatchescount', e => this.searchResults.next(e.matchesCount));
    this.pdfViewer.eventBus.on('pagechanging', e => this.stateChange.next(new SetCurrentPageOperation(e.pageNumber)));
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
      this.printService.printDocumentNatively(this.url);
    }
  }

  @Input()
  set downloadOperation(operation: DownloadOperation | null) {
    if (operation) {
      this.pdfWrapper.downloadFile(this.url, this.downloadFileName);
    }
  }

  @Input()
  set changePage(operation: ChangePageByDeltaOperation | SetCurrentPageOperation | null) {
    if (operation) {
      if ((<SetCurrentPageOperation>operation).pageNumber) {
        this.pdfViewer.currentPageNumber = (<SetCurrentPageOperation>operation).pageNumber;
      } else if ((<ChangePageByDeltaOperation>operation).delta) {
        const currentPage = this.pdfViewer.currentPageNumber;
        this.pdfViewer.currentPageNumber = currentPage + (<ChangePageByDeltaOperation>operation).delta;
      }
    }
  }



}

enum FindState {
  FOUND = 0,
  NOT_FOUND = 1,
  WRAPPED = 2,
  PENDING = 3,
}
