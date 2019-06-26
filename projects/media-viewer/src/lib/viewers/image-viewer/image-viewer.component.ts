import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import { Subject } from 'rxjs';
import {
  DownloadOperation,
  PrintOperation,
  RotateOperation,
  StepZoomOperation,
  ZoomOperation,
  ZoomValue
} from '../../events/viewer-operations';
import { PrintService } from '../../print.service';
import { AnnotationApiService } from '../../annotations/annotation-api.service';
import { Annotation } from '../../annotations/annotation-set/annotation/annotation.model';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';
import { Rectangle } from '../../annotations/annotation-set/annotation/rectangle/rectangle.model';
import uuid from 'uuid/v4';

@Component({
    selector: 'mv-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnChanges {

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() zoomValue: Subject<ZoomValue>;
  @Input() drawMode: Subject<boolean>;
  @Input() annotationSet: AnnotationSet | null;

  errorMessage: string;

  @ViewChild('img') img: ElementRef;
  rotation = 0;
  zoom = 1;

  constructor(
    private readonly printService: PrintService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.url) {
      this.errorMessage = null;
    }
  }

  @Input()
  set rotateOperation(operation: RotateOperation | null) {
    if (operation) {
      this.rotation = (this.rotation + operation.rotation + 360) % 360;
    }
  }

  @Input()
  set zoomOperation(operation: ZoomOperation | null) {
    if (operation && !isNaN(operation.zoomFactor)) {
      this.setZoomValue(this.calculateZoomValue(+operation.zoomFactor)).then(() => {});
    }
  }

  @Input()
  set stepZoomOperation(operation: StepZoomOperation | null) {
    if (operation && !isNaN(operation.zoomFactor)) {
      this.setZoomValue(Math.round(this.calculateZoomValue(this.zoom, operation.zoomFactor) * 10) / 10)
        .then(() => {});
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

  // the returned promise is a work-around
  setZoomValue(zoomValue) {
    return new Promise((resolve) => {
      this.zoom = zoomValue;
      this.zoomValue.next({ value: zoomValue });
      resolve(true);
    });
  }

  calculateZoomValue(zoomValue, increment = 0) {
    const newZoomValue = zoomValue + increment;
    if (newZoomValue > 5) { return 5; }
    if (newZoomValue < 0.1) { return 0.1; }
    return newZoomValue;
  }

  onLoadError() {
    this.errorMessage = `Could not load the image "${this.url}"`;
  }

}
