import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
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
import { Annotation } from '../../annotations/annotation.model';
import { AnnotationSet } from '../../annotations/annotation-set.model';

@Component({
    selector: 'mv-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnChanges {

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() zoomValue: Subject<ZoomValue>;
  @Input() annotationSet: AnnotationSet | null;

  selectedAnnotation = new Subject<string>();
  errorMessage: string;

  @ViewChild('img') img: ElementRef;
  rotation = 0;
  zoom = 1;
  rotationStyle;
  zoomStyle;

  constructor(
    private readonly printService: PrintService,
    private readonly api: AnnotationApiService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.url) {
      this.errorMessage = null;
    }
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
      this.zoom = Math.round(this.updateZoomValue(this.zoom, operation.zoomFactor) * 10) / 10;
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

  onLoadError() {
    this.errorMessage = `Could not load the image "${this.url}"`;
  }

  public updateAnnotation(updatedAnnotation: Annotation) {
    const annotations = this.annotationSet.annotations
      .filter(annotation => annotation.id !== updatedAnnotation.id);
    annotations.push(updatedAnnotation);
    this.annotationSet.annotations = annotations;
    this.api.postAnnotationSet(this.annotationSet);
  }
}
