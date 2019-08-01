import { Observable, Subject } from 'rxjs';
import { AnnotationApiService } from '../../../projects/media-viewer/src/lib/annotations/annotation-api.service';
import {
  defaultImageOptions,
  defaultPdfOptions,
  defaultUnsupportedOptions,
  ToolbarButtonVisibilityService
} from '../../../projects/media-viewer/src/lib/toolbar/toolbar-button-visibility.service';
import { AnnotationSet } from '../../../projects/media-viewer/src/lib/annotations/annotation-set/annotation-set.model';
import {AfterContentInit, AfterViewInit, Component} from '@angular/core';
import { Comment } from '../../../projects/media-viewer/src/lib/annotations/annotation-set/annotation/comment/comment.model';

@Component({
  selector: 'media-viewer-wrapper',
  templateUrl: './media-viewer-wrapper.component.html'
})
export class MediaViewerWrapperComponent implements AfterContentInit {

  pdfUrl = 'assets/example.pdf';
  imageUrl = 'assets/example.jpg';
  unsupportedUrl = 'assets/unsupported.txt';
  filename = 'filename';
  unsupportedType = 'txt';

  selectedTab = 'pdf';
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
    this.selectTab(this.selectedTab);
  }

  selectTab(newTab: string) {
    this.selectedTab = newTab;

    if (newTab === 'pdf') {
      this.url = this.pdfUrl;
      this.toolbarButtons.reset({ ...defaultPdfOptions, showHighlight: this.enableAnnotations });
    } else if (newTab === 'image') {
      this.url = this.imageUrl;
      this.toolbarButtons.reset({ ...defaultImageOptions, showHighlight: this.enableAnnotations });
    } else {
      this.url = this.unsupportedUrl;
      this.toolbarButtons.reset(defaultUnsupportedOptions);
    }
    this.setDocumentUrl(this.url);
  }

  toggleToolbar(showToolbar: boolean) {
    this.showToolbar = showToolbar;
  }

  toggleAnnotations(showAnnotations: boolean) {
    this.enableAnnotations = showAnnotations;
    this.toolbarButtons.showHighlight = showAnnotations;
  }

  tabLinkStyle(currentTab: string) {
    return `govuk-tabs__tab ${this.selectedTab === currentTab ? 'govuk-tabs__tab--selected' : ''}`;
  }

  setDocumentUrl(newUrl: string) {
    this.url = newUrl;
  }

  onMediaLoad(loadStatus: string) {
    this.mediaLoadStatus = loadStatus;
    setTimeout(() => this.mediaLoadStatus = undefined, 2000);
  }
}
