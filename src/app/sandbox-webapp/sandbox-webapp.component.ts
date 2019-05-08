import { Component } from '@angular/core';
import {
  ActionEvents, RotateOperation, SearchOperation, ZoomOperation
} from '../../../projects/media-viewer/src/lib/media-viewer/media-viewer.model';

@Component({
    selector: 'app-sandbox-webapp',
    templateUrl: './sandbox-webapp.component.html'
})
export class SandboxWebappComponent {

    documentTypeToShow = 'nonDM_PDF';
    actionEvents: ActionEvents;

    constructor() {
      this.actionEvents = new ActionEvents();
    }

    rotate(rotation: number) {
      this.actionEvents.rotate.next(new RotateOperation(rotation));
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
