import {Observable} from 'rxjs';
import {AfterContentInit, Component, ViewEncapsulation} from '@angular/core';
import {Comment} from '../../../projects/media-viewer/src/lib/annotations/comment-set/comment/comment.model';
import {ToolbarEventService} from '../../../projects/media-viewer/src/lib/toolbar/toolbar-event.service';

@Component({
  selector: 'media-viewer-wrapper',
  templateUrl: './media-viewer-wrapper.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MediaViewerWrapperComponent implements AfterContentInit {

  pdfUrl = '86dc297a-0153-44c0-b996-f563c1ff112a';
  imageUrl = '9a55775d-3326-4be1-9731-6806e948e557';
  audioUrl = 'http://localhost:8080/hearing-recordings/9c5603f4-7cd1-4718-b49d-db64d9eb6595/segments/0';
  unsupportedUrl = 'assets/unsupported.txt';
  filename = 'filename';
  caseId = 'dummyCaseId';

  documentType = 'pdf';
  url;
  comments: Observable<Comment[]>;

  mediaLoadStatus: string;
  unsavedChanges: boolean;

  showToolbar = true;
  showCustomToolbar = false;
  toolbarEvents;
  enableAnnotations = false;
  enableRedactions = false;
  enableICP = false;
  toolbarButtonOverrides: {};
  showHeader = true;

  ngAfterContentInit() {
    this.setDocumentType(this.documentType);
  }

  setDocumentType(newTab: string) {
    this.documentType = newTab;
    if (newTab === 'pdf') {
      this.setDocumentUrl(this.pdfUrl);
    } else if (newTab === 'image') {
      this.setDocumentUrl(this.imageUrl);
    } else if (newTab === 'mp4') {
      this.setDocumentUrl(this.audioUrl);
    } else {
      this.setDocumentUrl(this.unsupportedUrl);
    }
  }

  setDocumentUrl(newUrl: string) {
    this.url = newUrl;
  }

  setFormData({ documentType, documentUrl, caseId }) {
    this.documentType = documentType;
    this.url = documentUrl;
    this.caseId = caseId;
  }

  toggleToolbar(showToolbar: boolean) {
    this.showToolbar = showToolbar;
    if (showToolbar) {
      this.showCustomToolbar = false;
    }
  }

  toggleCustomToolbar(showCustomToolbar: boolean) {
    this.showCustomToolbar = showCustomToolbar;
    if (showCustomToolbar) {
      this.showToolbar = false;
    }
  }

  toggleAnnotations(showAnnotations: boolean) {
    this.enableAnnotations = showAnnotations;
  }

  toggleRedaction(showRedaction: boolean) {
    this.enableRedactions = showRedaction;
  }

  toggleICP(showICP: boolean) {
    this.enableICP = showICP;
  }

  onMediaLoad(loadStatus: ResponseType) {
    this.mediaLoadStatus = loadStatus;
    setTimeout(() => this.mediaLoadStatus = undefined, 2000);
  }

  onUnsavedChanges(changes: boolean) {
    this.unsavedChanges = changes;
  }

  toggleToolbarBtns(toolbarButtonOverrides: any) {
    this.toolbarButtonOverrides = { ...toolbarButtonOverrides };
  }

  getToolbarFunctions(toolbarEvent: ToolbarEventService) {
    this.toolbarEvents = toolbarEvent;
  }

  toggleHeader() {
    this.showHeader = !this.showHeader;
  }
}
