import { Component, Input } from '@angular/core';
import { ActionEvents, ZoomOperation } from '../../media-viewer.model';

@Component({
  selector: 'mv-tb-middle-pane',
  templateUrl: './middle-pane.component.html',
  styleUrls: ['../styles/toolbar.component.scss']
})
export class ToolbarMiddlePaneComponent {

  @Input() actionEvents: ActionEvents;

  constructor() {}

  zoom(zoomFactor: number) {
    this.actionEvents.zoom.next(new ZoomOperation(zoomFactor));
  }
}
