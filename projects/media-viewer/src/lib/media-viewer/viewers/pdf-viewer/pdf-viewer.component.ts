import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {MediaViewerFeatures} from '../../media-viewer-features';
import {PdfWrapper} from '../../../data/js-wrapper/pdf-wrapper';


@Component({
    selector: 'app-pdf-viewer',
    templateUrl: './pdf-viewer.component.html',
    styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements AfterViewInit {

  @Input() url: string;
  @Input() mediaViewerFeatures = new MediaViewerFeatures();
  @ViewChild('viewerContainer') viewerContainer: ElementRef;

  constructor(private pdfWrapper: PdfWrapper) {
  }

  ngAfterViewInit(): void {
      this.pdfWrapper.initViewer(this.url, this.viewerContainer);
  }

}
