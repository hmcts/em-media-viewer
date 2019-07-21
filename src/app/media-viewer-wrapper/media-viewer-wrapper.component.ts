import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { AnnotationApiService } from '../../../projects/media-viewer/src/lib/annotations/annotation-api.service';
import {
  defaultImageOptions,
  defaultPdfOptions, defaultUnsupportedOptions,
  ToolbarButtonVisibilityService
} from '../../../projects/media-viewer/src/lib/toolbar/toolbar-button-visibility.service';
import { AnnotationSet } from '../../../projects/media-viewer/src/lib/annotations/annotation-set/annotation-set.model';

@Component({
  selector: 'media-viewer-wrapper',
  templateUrl: './media-viewer-wrapper.component.html'
})
export class MediaViewerWrapperComponent {

  pdfUrl = 'assets/example.pdf';
  imageUrl = 'assets/example.jpg';
  unsupportedUrl = 'assets/unsupported.txt';
  filename = 'filename';
  unsupportedType = 'txt';

  selectedTab = 'pdf';
  url = this.pdfUrl;
  annotationSet: AnnotationSet;
  comments = [];

  showToolbar = true;
  enableAnnotations = false;
  showCommentSummary = new Subject<boolean>();

  constructor(
    public readonly api: AnnotationApiService,
    public readonly toolbarButtons: ToolbarButtonVisibilityService
  ) {
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
    if (newUrl.startsWith('/documents/')) {
      const documentId = newUrl.split('/')[2];

      this.api.getOrCreateAnnotationSet(documentId).subscribe(annotationSet => this.annotationSet = annotationSet);
      this.api.getComments(documentId).subscribe(comments => this.comments = comments);
      this.url = newUrl.endsWith('/binary') ? newUrl : newUrl + '/binary';
    }
  }
}
