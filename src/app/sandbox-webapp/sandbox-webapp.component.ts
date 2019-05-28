import {Component} from '@angular/core';

@Component({
  selector: 'app-sandbox-webapp',
  templateUrl: './sandbox-webapp.component.html',
  styleUrls: ['./sandbox-webapp.component.scss']
})
export class SandboxWebappComponent {

  pdfUrl = 'assets/example.pdf';
  imageUrl = 'assets/example.jpg';
  unsupportedUrl = 'assets/unsupported.txt';

  documentTypeToShow = 'nonDM_PDF';
  showToolbar = true;

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
