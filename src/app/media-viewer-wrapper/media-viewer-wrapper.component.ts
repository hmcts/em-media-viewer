import { Component, OnInit } from '@angular/core';
import { ToolbarButtonToggles } from '../../../projects/media-viewer/src/lib/events/toolbar-button-toggles';
import { Subject } from 'rxjs';
import { AnnotationApiService } from '../../../projects/media-viewer/src/lib/annotations/annotation-api.service';

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

  toolbarButtons = new ToolbarButtonToggles();
  showCommentSummary = new Subject<boolean>();
  comments = [];

  constructor(
    public api: AnnotationApiService
  ) {}

  selectTab(currentTab: string) {
    this.selectedTab = currentTab;
  }

  toggleToolbarVisibility(showToolbar: boolean) {
    this.showToolbar = showToolbar;
  }

  tabLinkStyle(currentTab: string) {
    return `govuk-tabs__tab ${this.selectedTab === currentTab ? 'govuk-tabs__tab--selected' : ''}`;
  }

  public ngOnInit(): void {
    this.api.getComments('1').subscribe(comments => this.comments = comments);
  }

  public ngOnInit(): void {
    this.api.getComments('1').subscribe(comments => this.comments = comments);
  }
}
