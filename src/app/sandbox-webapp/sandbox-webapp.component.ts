import {Component} from '@angular/core';
import {MediaViewerMessageService} from '../../../projects/media-viewer/src/lib/media-viewer/service/media-viewer-message.service';
import {
  RotateDirection,
  RotateOperation, SearchOperation,
  ZoomOperation
} from '../../../projects/media-viewer/src/lib/media-viewer/service/media-viewer-message.model';

@Component({
    selector: 'app-sandbox-webapp',
    templateUrl: './sandbox-webapp.component.html'
})
export class SandboxWebappComponent {

    documentTypeToShow = 'nonDM_PDF';

    constructor(private mediaViewerMessageService: MediaViewerMessageService) {}

    toggleDocumentSelection(selectedDocumentType: string) {
      this.documentTypeToShow = selectedDocumentType;
    }

    rotate(rotateDirectionStr: string) {
      this.mediaViewerMessageService.sendMessage(new RotateOperation(RotateDirection[rotateDirectionStr]));
    }

    zoom(zoomFactor: number) {
      this.mediaViewerMessageService.sendMessage(new ZoomOperation(zoomFactor));
    }

    searchPrev(searchTerm: string) {
      this.mediaViewerMessageService.sendMessage(new SearchOperation(searchTerm, true));
    }

    searchNext(searchTerm: string) {
      this.mediaViewerMessageService.sendMessage(new SearchOperation(searchTerm));
    }
}
