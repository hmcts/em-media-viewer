import { Component, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-toolbar-viewer-left',
  template: `
    <div id="toolbarViewerLeft">
      <button id="sidebarToggle" class="toolbarButton" title="Toggle Sidebar" tabindex="11"
              data-l10n-id="toggle_sidebar" (click)="toggleSidebar()">
        <span data-l10n-id="toggle_sidebar_label">Toggle Sidebar</span>
      </button>
      <div class="toolbarButtonSpacer"></div>
      <button id="viewFind" class="toolbarButton" title="Find in Document" tabindex="12" data-l10n-id="findbar"
              (click)="toggleSearch()">
        <span data-l10n-id="findbar_label">Find</span>
      </button>
      <div class="splitToolbarButton hiddenSmallView">
        <button class="toolbarButton pageUp" title="Previous Page" id="previous" tabindex="13"
                data-l10n-id="previous">
          <span data-l10n-id="previous_label">Previous</span>
        </button>
        <div class="splitToolbarButtonSeparator"></div>
        <button class="toolbarButton pageDown" title="Next Page" id="next" tabindex="14" data-l10n-id="next">
          <span data-l10n-id="next_label">Next</span>
        </button>
      </div>
      <input type="number" id="pageNumber" class="toolbarField pageNumber" title="Page" value="1" size="4" min="1"
             tabindex="15" data-l10n-id="page">
      <span id="numPages" class="toolbarLabel"></span>
    </div>
  `,
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarViewerLeftComponent {

  @Output() sidebarToggle = new BehaviorSubject(true);
  @Output() searchToggle = new BehaviorSubject(true);

  constructor() {}

  toggleSidebar() {
    this.sidebarToggle.next(true);
  }

  toggleSearch() {
    this.searchToggle.next(true);
  }
}
