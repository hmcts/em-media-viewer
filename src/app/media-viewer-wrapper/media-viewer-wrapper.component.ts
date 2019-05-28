import { Component } from '@angular/core';
import { ToolbarButtonToggles } from '../../../projects/media-viewer/src/lib/media-viewer/model/toolbar-button-toggles';

@Component({
  selector: 'app-sandbox-webapp',
  templateUrl: './media-viewer-wrapper.component.html'
})
export class MediaViewerWrapperComponent {

  documentTypeToShow = 'pdf';
  showToolbar: boolean;
  toolbarButtons = new ToolbarButtonToggles();

  toggleToolbarVisibility(showToolbar: boolean) {
    this.showToolbar = showToolbar;
  }

  toggleDocumentSelection(selectedDocumentType: string) {
    this.documentTypeToShow = selectedDocumentType;
  }

  tabLinkStyle(documentType: string) {
    return `govuk-tabs__tab ${this.documentTypeToShow === documentType ? 'govuk-tabs__tab--selected' : ''}`;
  }
}
