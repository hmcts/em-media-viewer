import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PdfJsWrapper } from './pdf-js/pdf-js-wrapper';
import { Subject } from 'rxjs';
import * as pdfjsViewer from 'pdfjs-dist/web/pdf_viewer';
import { PrintService } from '../../print.service';
import {
  ChangePageByDeltaOperation,
  DownloadOperation,
  PrintOperation,
  RotateOperation, SearchOperation,
  SearchResultsCount,
  SetCurrentPageOperation, StepZoomOperation,
  ZoomOperation,
  ZoomValue
} from '../../model/viewer-operations';
import { ToolbarToggles } from '../../model/toolbar-toggles';

@Component({
  selector: 'mv-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements AfterViewInit {

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() searchResults: Subject<SearchResultsCount>;
  @Input() zoomValue: Subject<ZoomValue>;
  @Input() currentPageChanged: Subject<SetCurrentPageOperation>;

  @ViewChild('viewerContainer') viewerContainer: ElementRef;

  pdfViewer: pdfjsViewer.PDFViewer;
  pdfFindController: pdfjsViewer.PDFFindController;

  constructor(private pdfWrapper: PdfJsWrapper, private printService: PrintService) {}

  async ngAfterViewInit(): Promise<void> {
    [this.pdfViewer, this.pdfFindController] = await this.pdfWrapper.initViewer(this.url, this.viewerContainer);

    this.pdfViewer.eventBus.on('updatefindcontrolstate', e => {
      if (e.state === FindState.NOT_FOUND || e.state === FindState.FOUND) {
        this.searchResults.next(e.matchesCount);
      }
    });
    this.pdfViewer.eventBus.on('updatefindmatchescount', e => {
      this.searchResults.next(e.matchesCount);
    });
    this.pdfViewer.eventBus.on('pagechanging', e => this.currentPageChanged.next(new SetCurrentPageOperation(e.pageNumber)));
  }


  @Input()
  set rotateOperation(operation: RotateOperation | null) {
    if (this.pdfViewer && operation) {
      this.pdfViewer.pagesRotation = (this.pdfViewer.pagesRotation + operation.rotation) % 360;
    }
  }

  @Input()
  set zoomOperation(operation: ZoomOperation | null) {
    if (this.pdfViewer && operation) {
      this.pdfViewer.currentScaleValue = this.updateZoomValue(operation.zoomFactor);
      this.zoomValue.next({ value: this.pdfViewer.currentScaleValue });
    }
  }

  @Input()
  set stepZoomOperation(operation: StepZoomOperation | null) {
    if (this.pdfViewer && operation) {
      const newZoomValue = this.pdfViewer.currentScale + operation.zoomFactor;
      this.pdfViewer.currentScaleValue = this.updateZoomValue(newZoomValue);
      this.zoomValue.next({ value: this.pdfViewer.currentScaleValue });
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
  set setCurrentPage(operation: SetCurrentPageOperation | null) {
    if (operation) {
      this.pdfViewer.currentPageNumber = operation.pageNumber;
    }
  }

  @Input()
  set changePageByDelta(operation: ChangePageByDeltaOperation | null) {
    if (operation) {
      const currentPage = this.pdfViewer.currentPageNumber;
      this.pdfViewer.currentPageNumber = currentPage + operation.delta;
    }
  }

  @Input()
  set toolbarToggles(toolbarToggles: ToolbarToggles | null) {
    if (toolbarToggles) {
      toolbarToggles.showSearchbarToggleBtn.next(true);
      toolbarToggles.showZoomBtns.next(true);
      toolbarToggles.showNavigationBtns.next(true);
      toolbarToggles.showDownloadBtn.next(true);
      toolbarToggles.showPrintBtn.next(true);
      toolbarToggles.showSubToolbarToggleBtn.next(true);
    }
  }


  updateZoomValue(zoomValue) {
    if (isNaN(zoomValue)) { return zoomValue; }
    if (zoomValue > 5) { return 5; }
    if (zoomValue < 0.1) { return 0.1; }
    return zoomValue;
  }
}

enum FindState {
  FOUND = 0,
  NOT_FOUND = 1,
  WRAPPED = 2,
  PENDING = 3,
}
