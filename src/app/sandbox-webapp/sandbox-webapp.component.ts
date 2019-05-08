import { Component } from '@angular/core';
import { MediaViewerMessageService } from '../../../projects/media-viewer/src/lib/media-viewer/service/media-viewer-message.service';
import {
  ActionEvents, RotateDirection,
  RotateOperation, SearchOperation, ZoomOperation
} from '../../../projects/media-viewer/src/lib/media-viewer/service/media-viewer-message.model';

@Component({
    selector: 'app-sandbox-webapp',
    templateUrl: './sandbox-webapp.component.html'
})
export class SandboxWebappComponent {

    documentTypeToShow = 'nonDM_PDF';
    actionEvents: ActionEvents;

    constructor(private mediaViewerMessageService: MediaViewerMessageService) {
      this.actionEvents = this.mediaViewerMessageService.actionEvents();
    }

    rotate(rotateDirectionStr: string) {
      this.actionEvents.rotate.next(new RotateOperation(RotateDirection[rotateDirectionStr]));
    }

    zoom(zoomFactor: number) {
      this.actionEvents.zoom.next(new ZoomOperation(zoomFactor));
    }

    searchPrev(searchTerm: string) {
      this.actionEvents.search.next(new SearchOperation(searchTerm, true));
    }

    searchNext(searchTerm: string) {
      this.actionEvents.search.next(new SearchOperation(searchTerm));
    }

    toggleDocumentSelection(selectedDocumentType: string) {
      this.documentTypeToShow = selectedDocumentType;
    }
}
