import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActionEvents, PrintOperation, DownloadOperation } from '../../media-viewer.model';

@Component({
  selector: 'mv-tb-right-pane',
  templateUrl: './right-pane.component.html',
  styleUrls: ['../styles/toolbar.component.scss']
})
export class ToolbarRightPaneComponent {

  @Input() actionEvents: ActionEvents;
  @Input() toggleSubToolbarHidden: BehaviorSubject<boolean>;

  constructor() {}

  toggleSecondaryToolbar() {
    this.toggleSubToolbarHidden.next(!this.toggleSubToolbarHidden.getValue());
  }

  printFile() {
    this.actionEvents.print.next(new PrintOperation());
  }

  downloadFile() {
    this.actionEvents.download.next(new DownloadOperation());
  }
}
