import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { AnnotationApiService } from '../../../projects/media-viewer/src/lib/annotations/annotation-api.service';
import { imageAnnotationSet } from '../../assets/mock-data/image-annotation-set';
import { pdfAnnotationSet } from '../../assets/mock-data/pdf-annotation-set';
import {
  defaultImageOptions,
  defaultPdfOptions, defaultUnsupportedOptions,
  ToolbarButtonVisibilityService
} from '../../../projects/media-viewer/src/lib/toolbar/toolbar-button-visibility.service';

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
  annotationSet = pdfAnnotationSet;
  comments = [];

  showToolbar = true;
  showAnnotations = false;
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
      this.annotationSet = pdfAnnotationSet;
      this.toolbarButtons.reset({ ...defaultPdfOptions, showHighlight: this.showAnnotations });
    } else if (newTab === 'image') {
      this.url = this.imageUrl;
      this.annotationSet = imageAnnotationSet;
      this.toolbarButtons.reset({ ...defaultImageOptions, showHighlight: this.showAnnotations });
    } else {
      this.url = this.unsupportedUrl;
      this.toolbarButtons.reset(defaultUnsupportedOptions);
    }
  }

  toggleToolbar(showToolbar: boolean) {
    this.showToolbar = showToolbar;
  }

  toggleAnnotations(showAnnotations: boolean) {
    this.showAnnotations = showAnnotations;
    this.toolbarButtons.showHighlight = showAnnotations;
  }

  tabLinkStyle(currentTab: string) {
    return `govuk-tabs__tab ${this.selectedTab === currentTab ? 'govuk-tabs__tab--selected' : ''}`;
  }

  setDocumentUrl(newUrl: string) {
    if (newUrl.startsWith('/documents/')) {
      const documentId = newUrl.split('/')[2];

      this.api.getComments(documentId).subscribe(comments => this.comments = comments);
      this.api.getOrCreateAnnotationSet(documentId).subscribe(annotationSet => this.annotationSet = annotationSet);
      this.url = newUrl.endsWith('/binary') ? newUrl : newUrl + '/binary';
    }
  }
}
