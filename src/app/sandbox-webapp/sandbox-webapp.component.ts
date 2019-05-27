import { Component } from '@angular/core';
import { ToolbarButtonToggles } from '../../../projects/media-viewer/src/lib/media-viewer/model/toolbar-button-toggles';

@Component({
  selector: 'app-sandbox-webapp',
  templateUrl: './sandbox-webapp.component.html',
  styleUrls: ['./sandbox-webapp.component.scss']
})
export class SandboxWebappComponent {

  documentTypeToShow = 'nonDM_PDF';
  showToolbar = true;
  toolbarButtons = new ToolbarButtonToggles();

  toggleDocumentSelection(selectedDocumentType: string) {
    this.documentTypeToShow = selectedDocumentType;
  }

  toggleToolbarVisibility(showToolbar: boolean) {
    this.showToolbar = showToolbar;
  }

  tabLinkStyle(documentType: string) {
    return `govuk-tabs__tab ${this.documentTypeToShow === documentType ? 'govuk-tabs__tab--selected' : ''}`;
  }
}
