import { Component, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActionEvents, GenericOperation } from '../../media-viewer.model';

@Component({
  selector: 'mv-tb-right-pane',
  templateUrl: './right-pane.component.html',
  styleUrls: ['../styles/toolbar.component.scss']
})
export class ToolbarViewerRightComponent {

  @Input() actionEvents: ActionEvents;
  @Input() subToolbarHide: BehaviorSubject<boolean>;

  constructor() {}

  toggleSecondaryToolbar() {
    this.subToolbarHide.next(!this.subToolbarHide.getValue());
  }

  printFile() {
    this.actionEvents.print.next(new GenericOperation('print'));
  }

  downloadFile() {
    this.actionEvents.download.next(new GenericOperation('download'));
  }
}
