import { Component, OnInit } from '@angular/core';
import { ToolbarButtonToggles } from '../../../projects/media-viewer/src/lib/events/toolbar-button-toggles';
import { Subject } from 'rxjs';
import { AnnotationApiService } from '../../../projects/media-viewer/src/lib/annotations/annotation-api.service';
import { imageAnnotationSet } from '../../assets/mock-data/image-annotation-set';
import { pdfAnnotationSet } from '../../assets/mock-data/pdf-annotation-set';

@Component({
  selector: 'media-viewer-wrapper',
  templateUrl: './media-viewer-wrapper.component.html'
})
export class MediaViewerWrapperComponent implements OnInit {

  pdfUrl = 'assets/example.pdf';
  pdfFileName = 'example.pdf';
  imageUrl = 'assets/example.jpg';
  imageFileName = 'example.jpg';
  unsupportedUrl = 'assets/unsupported.txt';
  unsupportedFileName = 'unsupported.txt';
  unsupportedType = 'txt';

  selectedTab = 'pdf';
  showToolbar = true;
  showAnnotations = false;

  toolbarButtons = new ToolbarButtonToggles();
  showCommentSummary = new Subject<boolean>();
  comments = [];

  imageAnnotationSet = imageAnnotationSet;
  pdfAnnotationSet = pdfAnnotationSet;

  constructor(
    public api: AnnotationApiService
  ) {}

  selectTab(currentTab: string) {
    this.selectedTab = currentTab;
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

  public ngOnInit(): void {
    this.api.getComments('1').subscribe(comments => this.comments = comments);
  }
}
