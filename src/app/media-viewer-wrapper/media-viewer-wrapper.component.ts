import {Observable} from 'rxjs';
import {AfterContentInit, Component, ViewEncapsulation} from '@angular/core';
import {Comment} from '../../../projects/media-viewer/src/lib/annotations/comment-set/comment/comment.model';
import {ToolbarEventService} from '@hmcts/media-viewer/lib/toolbar/toolbar-event.service';

@Component({
  selector: 'media-viewer-wrapper',
  templateUrl: './media-viewer-wrapper.component.html',
  styleUrls: ['./meida-viewer-wrapper.component.scss'],
  encapsulation: ViewEncapsulation.None
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
  unsavedChanges: boolean;

  showToolbar = true;
  showCustomToolbar = false;
  toolbarEvents;
  enableAnnotations = false;
  toolbarButtonOverrides: {};

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

  setDocumentUrl(newUrl: string) {
    this.url = newUrl;
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
}
