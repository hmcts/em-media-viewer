import { Component } from '@angular/core';
import { ActionEvents } from '../../../projects/media-viewer/src/lib/media-viewer/media-viewer.model';

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

    toggleDocumentSelection(selectedDocumentType: string) {
      this.documentTypeToShow = selectedDocumentType;
    }
}
