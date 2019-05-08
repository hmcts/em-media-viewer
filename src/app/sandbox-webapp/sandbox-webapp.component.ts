import {Component} from '@angular/core';
import {
  RotateDirection,
  RotateOperation, SearchOperation,
  ZoomOperation
} from '../../../projects/media-viewer/src/lib/media-viewer/service/media-viewer-message.model';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-sandbox-webapp',
    templateUrl: './sandbox-webapp.component.html'
})
export class SandboxWebappComponent {

    documentTypeToShow = 'nonDM_PDF';
    rotateOperation = new Subject<RotateOperation>();
    searchOperation = new Subject<SearchOperation>();
    zoomOperation = new Subject<ZoomOperation>();

    toggleDocumentSelection(selectedDocumentType: string) {
      this.documentTypeToShow = selectedDocumentType;
    }

}
