import {Component} from '@angular/core';

@Component({
    selector: 'app-sandbox-webapp',
    templateUrl: './sandbox-webapp.component.html'
})
export class SandboxWebappComponent {

    documentTypeToShow = 'nonDM_PDF';

    toggleDocumentSelection(selectedDocumentType: string) {
      this.documentTypeToShow = selectedDocumentType;
    }

}
