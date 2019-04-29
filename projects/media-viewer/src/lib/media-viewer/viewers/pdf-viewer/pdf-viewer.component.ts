import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {MediaViewerFeatures} from '../../media-viewer-features';
import {PdfWrapper} from '../../../data/js-wrapper/pdf-wrapper';
import {MediaViewerMessageService} from '../../service/media-viewer-message.service';
import {Subscription} from 'rxjs';
import {
  MediaViewerMessage,
  RotateDirection,
  RotateOperation,
  SearchOperation,
  ZoomOperation
} from '../../service/media-viewer-message.model';


@Component({
    selector: 'app-pdf-viewer',
    templateUrl: './pdf-viewer.component.html',
    styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements AfterViewInit, OnDestroy {

  @Input() url: string;
  @Input() mediaViewerFeatures = new MediaViewerFeatures();
  @ViewChild('viewerContainer') viewerContainer: ElementRef;

  pdfViewer: any;
  pdfFindController: any;

  subscription: Subscription;

  constructor(private pdfWrapper: PdfWrapper, private mediaViewerMessageService: MediaViewerMessageService) {
    this.subscription = this.mediaViewerMessageService.getMessage().subscribe( newMessage =>
      this.handleMessage(newMessage) );
  }

  ngAfterViewInit(): void {
    [this.pdfViewer, this.pdfFindController]
      = this.pdfWrapper.initViewer(this.url, this.viewerContainer);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  handleMessage(genericMessage: MediaViewerMessage) {
    if (genericMessage instanceof RotateOperation) {
      this.rotate(genericMessage);
    }
    if (genericMessage instanceof ZoomOperation) {
      this.zoom(genericMessage);
    }
    if (genericMessage instanceof SearchOperation) {
      this.search(genericMessage);
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
