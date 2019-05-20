import { Component, Input } from '@angular/core';
import { ActionEvents } from '../../model/action-events';
import { ToolbarToggles } from '../../model/toolbar-toggles';
import { DownloadOperation, PrintOperation } from '../../model/viewer-operations';

@Component({
  selector: 'mv-tb-right-pane',
  templateUrl: './right-pane.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class ToolbarRightPaneComponent {

  @Input() actionEvents: ActionEvents;
  @Input() toolbarToggles: ToolbarToggles;

  constructor() {}

  toggleSecondaryToolbar() {
    this.toolbarToggles.subToolbarHidden.next(!this.toolbarToggles.subToolbarHidden.getValue());
  }

  printFile() {
    this.actionEvents.print.next(new PrintOperation());
  }

  downloadFile() {
    this.actionEvents.download.next(new DownloadOperation());
  }
}
