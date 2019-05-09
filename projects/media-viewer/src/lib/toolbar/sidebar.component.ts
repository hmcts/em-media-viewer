import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  template: `
    <div>
      <div id="toolbarSidebar">
        <div class="splitToolbarButton toggled">
          <button id="viewThumbnail" class="toolbarButton toggled" title="Show Thumbnails" tabindex="2"
                  data-l10n-id="thumbs">
            <span data-l10n-id="thumbs_label">Thumbnails</span>
          </button>
          <button id="viewOutline" class="toolbarButton"
                  title="Show Document Outline (double-click to expand/collapse all items)" tabindex="3"
                  data-l10n-id="document_outline">
            <span data-l10n-id="document_outline_label">Document Outline</span>
          </button>
          <button id="viewAttachments" class="toolbarButton" title="Show Attachments" tabindex="4"
                  data-l10n-id="attachments">
            <span data-l10n-id="attachments_label">Attachments</span>
          </button>
        </div>
      </div>
      <div id="sidebarContent">
        <div id="thumbnailView">
        </div>
        <div id="outlineView">
        </div>
        <div id="attachmentsView" class="hidden">
        </div>
      </div>
      <div id="sidebarResizer"></div>
    </div>
  `,
  styleUrls: ['./toolbar.component.scss']
})
export class SidebarComponent {

  constructor() {}
}
