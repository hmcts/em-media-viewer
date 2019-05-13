import { Component, Input } from '@angular/core';
import { ActionEvents, PrintOperation, DownloadOperation, RotateOperation } from '../../media-viewer.model';

@Component({
  selector: 'mv-sub-toolbar',
  templateUrl: './sub-toolbar.component.html',
  styleUrls: ['../styles/toolbar.component.scss']
})
export class SubToolbarComponent {

  @Input() subToolbarHide;
  @Input() actionEvents: ActionEvents;

  constructor() {}

  rotate(rotation: number) {
    this.actionEvents.rotate.next(new RotateOperation(rotation));
  }

  printFile() {
    this.actionEvents.print.next(new PrintOperation());
  }

  downloadFile() {
    this.actionEvents.download.next(new DownloadOperation());
  }
}
