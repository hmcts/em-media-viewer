import { Component, Input } from '@angular/core';
import { ActionEvents, ZoomOperation } from '../media-viewer/media-viewer.model';

@Component({
  selector: 'app-toolbar-ctx-menu',
  template: `
    <menu type="context" id="viewerContextMenu">
      <menuitem id="contextFirstPage" label="First Page"
                data-l10n-id="first_page"></menuitem>
      <menuitem id="contextLastPage" label="Last Page"
                data-l10n-id="last_page"></menuitem>
      <menuitem id="contextPageRotateCw" label="Rotate Clockwise"
                data-l10n-id="page_rotate_cw"></menuitem>
      <menuitem id="contextPageRotateCcw" label="Rotate Counter-Clockwise"
                data-l10n-id="page_rotate_ccw"></menuitem>
    </menu>
  `,
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarContextMenuComponent {

  @Input() actionEvents: ActionEvents;

  constructor() {}

  zoom(zoomFactor: number) {
    this.actionEvents.zoom.next(new ZoomOperation(zoomFactor));
  }
}
