import { Component, Input } from '@angular/core';
import { ZoomOperation } from '../../media-viewer.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'mv-tb-middle-pane',
  templateUrl: './middle-pane.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class ToolbarMiddlePaneComponent {

  @Input() zoomEvent: Subject<ZoomOperation>;

  constructor() {}

  zoom(zoomFactor: number) {
    this.zoomEvent.next(new ZoomOperation(zoomFactor));
  }
}
