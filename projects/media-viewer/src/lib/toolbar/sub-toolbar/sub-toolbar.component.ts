import { Component, Input } from '@angular/core';
import { ActionEvents, RotateOperation } from '../../media-viewer/media-viewer.model';

@Component({
  selector: 'mv-sub-toolbar',
  templateUrl: './sub-toolbar.component.html',
  styleUrls: ['../toolbar.component.scss']
})
export class SubToolbarComponent {

  @Input() subToolbarToggle;
  @Input() actionEvents: ActionEvents;

  constructor() {}

  rotate(rotation: number) {
    this.actionEvents.rotate.next(new RotateOperation(rotation));
  }
}
