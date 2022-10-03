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

  pdfUrl = '7547364e-5e49-452b-82e9-8d4b8a334a53';
  imageUrl = '69fb7313-5338-42c4-b94d-0ceb3b6ed18b';
  multimediaUrl = 'assets/multimedia/movie.mp4';
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
  enableMultimediaPlayer = false;
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
    } else if (newTab.startsWith('mp')) {
      this.setDocumentUrl(this.multimediaUrl);
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

  toggleMultimediaPlayer(showMultimediaPlayer: boolean) {
    this.enableMultimediaPlayer = showMultimediaPlayer;
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
