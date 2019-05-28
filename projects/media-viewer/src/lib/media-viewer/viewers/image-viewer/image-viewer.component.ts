import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { PrintService } from '../../service/print.service';
import {Subject} from 'rxjs';
import {
  DownloadOperation,
  PrintOperation,
  RotateOperation,
  StepZoomOperation,
  ZoomOperation,
  ZoomValue
} from '../../model/viewer-operations';
import { ToolbarToggles } from '../../model/toolbar-toggles';

@Component({
    selector: 'mv-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent {

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() zoomValue: Subject<ZoomValue>;

  @ViewChild('img') img: ElementRef;
  rotation = 0;
  zoom = 1;
  rotationStyle;
  zoomStyle;

  constructor(private printService: PrintService) {
  }


  @Input()
  set rotateOperation(operation: RotateOperation | null) {
    if (operation) {
      this.rotation += operation.rotation;
      this.setImageStyles();
    }
  }

  @Input()
  set zoomOperation(operation: ZoomOperation | null) {
    if (operation && !isNaN(operation.zoomFactor)) {
      this.zoom = this.updateZoomValue(+operation.zoomFactor);
      this.setZoomValue(this.zoom)
        .then(() => this.setImageStyles());
    }
  }

  @Input()
  set stepZoomOperation(operation: StepZoomOperation | null) {
    if (operation && !isNaN(operation.zoomFactor)) {
      this.zoom = this.updateZoomValue(this.zoom, operation.zoomFactor);
      this.setZoomValue(this.zoom)
        .then(() => this.setImageStyles());
    }
  }

  @Input()
  set printOperation(operation: PrintOperation | null) {
    if (operation) {
      this.printService.printDocumentNatively(this.url);
    }
  }

  @Input()
  set downloadOperation(operation: DownloadOperation | null) {
    if (operation) {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.setAttribute('style', 'display: none');
      a.href = this.url;
      a.download = this.downloadFileName;
      a.click();
      a.remove();
    }
  }

  @Input()
  set toolbarToggles(toolbarToggles: ToolbarToggles) {
    if (toolbarToggles) {
      toolbarToggles.showZoomBtns.next(true);
      toolbarToggles.showRotateBtns.next(true);
      toolbarToggles.showDownloadBtn.next(true);
      toolbarToggles.showPrintBtn.next(true);
    }
  }

  setImageStyles() {
    this.zoomStyle = `scale(${this.zoom})`;
    this.rotationStyle = `rotate(${this.rotation}deg)`;
  }

  setZoomValue(zoomValue) {
    return new Promise((resolve) => {
      this.zoomValue.next({ value: zoomValue });
      resolve(true);
    });
  }

  updateZoomValue(zoomValue, increment = 0) {
    const newZoomValue = zoomValue + increment;
    if (newZoomValue > 5) { return 5; }
    if (newZoomValue < 0.1) { return 0.1; }
    return newZoomValue;
  }
}
