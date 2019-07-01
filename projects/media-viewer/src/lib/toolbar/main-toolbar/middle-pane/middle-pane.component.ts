import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { RotateOperation, StepZoomOperation, ZoomOperation, ZoomValue } from '../../../shared/viewer-operations';
import { ToolbarButtonVisibilityService } from '../../toolbar-button-visibility.service';

@Component({
  selector: 'mv-tb-middle-pane',
  templateUrl: './middle-pane.component.html',
  styleUrls: ['../../../styles/main.scss']
})
export class ToolbarMiddlePaneComponent {

  @Input() zoomEvent: Subject<ZoomOperation>;
  @Input() stepZoomEvent: Subject<StepZoomOperation>;
  @Input() rotateEvent: Subject<RotateOperation>;
  @Input() zoomValue: ZoomValue;

  @ViewChild('zoomSelect') zoomSelect: ElementRef;

  constructor(
    public readonly toolbarButtons: ToolbarButtonVisibilityService
  ) {}

  zoom(zoomFactor: number) {
    this.zoomEvent.next(new ZoomOperation(zoomFactor));
  }

  stepZoom(zoomFactor: number) {
    this.stepZoomEvent.next(new StepZoomOperation(zoomFactor));
    this.zoomSelect.nativeElement.selected = 'selected';
  }

  rotate(rotation: number) {
    this.rotateEvent.next(new RotateOperation(rotation));
  }
}
