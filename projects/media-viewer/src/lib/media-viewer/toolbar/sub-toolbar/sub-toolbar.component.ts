import { Component, Input } from '@angular/core';
import { ActionEvents } from '../../model/action-events';
import { DownloadOperation, PrintOperation, RotateOperation } from '../../model/viewer-operations';

@Component({
  selector: 'mv-sub-toolbar',
  templateUrl: './sub-toolbar.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class SubToolbarComponent {

  @Input() subToolbarHidden;
  @Input() actionEvents: ActionEvents;

  printFile() {
    this.actionEvents.print.next(new PrintOperation());
  }

  downloadFile() {
    this.actionEvents.download.next(new DownloadOperation());
  }
}
