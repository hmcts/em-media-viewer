import { Observable, Subject } from 'rxjs';
import { AnnotationApiService } from '../../../projects/media-viewer/src/lib/annotations/annotation-api.service';
import {
  ToolbarButtonVisibilityService
} from '../../../projects/media-viewer/src/lib/toolbar/toolbar-button-visibility.service';
import { AfterContentInit, Component } from '@angular/core';
import { Comment } from '../../../projects/media-viewer/src/lib/annotations/comment-set/comment/comment.model';

@Component({
  selector: 'media-viewer-wrapper',
  templateUrl: './media-viewer-wrapper.component.html'
})
export class MediaViewerWrapperComponent implements AfterContentInit {

  pdfUrl = 'assets/example4.pdf';
  imageUrl = 'assets/example.jpg';
  unsupportedUrl = 'assets/unsupported.txt';
  filename = 'filename';
  unsupportedType = null;

  documentType = 'pdf';
  url;
  comments: Observable<Comment[]>;

  mediaLoadStatus: string;

  showToolbar = true;
  enableAnnotations = false;
  showCommentSummary = new Subject<boolean>();

  constructor(
    private readonly api: AnnotationApiService,
    private readonly toolbarButtons: ToolbarButtonVisibilityService
  ) {
  }

  ngAfterContentInit() {
    this.setDocumentType(this.documentType);
  }

  setDocumentType(newTab: string) {
    this.documentType = newTab;

    if (newTab === 'pdf') {
      this.url = this.pdfUrl;
    } else if (newTab === 'image') {
      this.url = this.imageUrl;
    } else {
      this.url = this.unsupportedUrl;
    }
    this.setDocumentUrl(this.url);
  }

  toggleToolbar(showToolbar: boolean) {
    this.showToolbar = showToolbar;
  }

  toggleAnnotations(showAnnotations: boolean) {
    this.enableAnnotations = showAnnotations;
    this.toolbarButtons.showHighlightButton = showAnnotations;
  }

  setDocumentUrl(newUrl: string) {
    this.url = newUrl;
  }

  onMediaLoad(loadStatus: ResponseType) {
    this.mediaLoadStatus = loadStatus;
    setTimeout(() => this.mediaLoadStatus = undefined, 2000);
  }
}
