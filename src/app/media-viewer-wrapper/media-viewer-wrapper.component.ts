import { Component } from '@angular/core';
import { ToolbarButtonToggles } from '../../../projects/media-viewer/src/lib/events/toolbar-button-toggles';

@Component({
  selector: 'media-viewer-wrapper',
  templateUrl: './media-viewer-wrapper.component.html'
})
export class MediaViewerWrapperComponent {

  pdfUrl = 'assets/example.pdf';
  pdfFileName = 'example.pdf';
  imageUrl = 'assets/example.jpg';
  imageFileName = 'example.jpg';
  unsupportedUrl = 'assets/unsupported.txt';
  unsupportedFileName = 'unsupported.txt';
  unsupportedType = 'txt';

  documentTypeToShow = 'pdf';
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
