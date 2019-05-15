import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ZoomOperation, StepZoomOperation, ZoomValue } from '../../media-viewer.model';

@Component({
  selector: 'mv-tb-middle-pane',
  templateUrl: './middle-pane.component.html',
  styleUrls: ['../../styles/main.scss']
})
export class ToolbarMiddlePaneComponent {

  @Input() zoomEvent: Subject<ZoomOperation>;
  @Input() stepZoomEvent: Subject<StepZoomOperation>;
  @Input() zoomValue: ZoomValue;
  @ViewChild('zoomSelect') zoomSelect: ElementRef;

  constructor() {}

  zoom(zoomFactor: number) {
    this.zoomEvent.next(new ZoomOperation(zoomFactor));
  }

  stepZoom(zoomFactor: number) {
    this.stepZoomEvent.next(new StepZoomOperation(zoomFactor));
  }
}
