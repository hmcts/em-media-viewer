import { Component, OnInit } from '@angular/core';
import { ToolbarButtonToggles } from '../../../projects/media-viewer/src/lib/shared/toolbar-button-toggles';
import { Subject } from 'rxjs';
import { AnnotationApiService } from '../../../projects/media-viewer/src/lib/annotations/annotation-api.service';
import { imageAnnotationSet } from '../../assets/mock-data/image-annotation-set';
import { pdfAnnotationSet } from '../../assets/mock-data/pdf-annotation-set';

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
  toolbarButtons = new ToolbarButtonToggles();
  showCommentSummary = new Subject<boolean>();

  constructor(
    public api: AnnotationApiService
  ) {}

  selectTab(newTab: string) {
    this.selectedTab = newTab;

    if (newTab === 'pdf') {
      this.url = this.pdfUrl;
      this.annotationSet = pdfAnnotationSet;
    } else if (newTab === 'image') {
      this.url = this.imageUrl;
      this.annotationSet = imageAnnotationSet;
    } else {
      this.url = this.unsupportedUrl;
    }
  }

  toggleToolbar(showToolbar: boolean) {
    this.showToolbar = showToolbar;
  }

  toggleAnnotations(showAnnotations: boolean) {
    this.showAnnotations = showAnnotations;
    this.toolbarButtons.showHighlightBtn = showAnnotations;
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
