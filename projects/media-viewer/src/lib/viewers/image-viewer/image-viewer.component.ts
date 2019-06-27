import {Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {
  DownloadOperation,
  PrintOperation,
  RotateOperation,
  StepZoomOperation,
  ZoomOperation,
  ZoomValue
} from '../../shared/viewer-operations';
import { PrintService } from '../../print.service';
import { AnnotationApiService } from '../../annotations/annotation-api.service';
import { Annotation } from '../../annotations/annotation-set/annotation/annotation.model';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';
import { Rectangle } from '../../annotations/annotation-set/annotation/rectangle/rectangle.model';
import uuid from 'uuid/v4';
import {ToolbarEventsService} from '../../shared/toolbar-events.service';

@Component({
    selector: 'mv-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnInit, OnDestroy, OnChanges {

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() zoomValue: Subject<ZoomValue>;
  @Input() annotationSet: AnnotationSet | null;

  drawMode = false;
  errorMessage: string;

  @ViewChild('img') img: ElementRef;
  @ViewChild('newRectangle') newRectangle: ElementRef;
  rotation = 0;
  zoom = 1;

  drawStartX = -1;
  drawStartY = -1;
  // local array of any subscriptions so that we can tidy them up later
  private subscriptions: Subscription[] = [];

  constructor(
    private readonly printService: PrintService,
    private readonly api: AnnotationApiService,
    private readonly toolbarEventsService: ToolbarEventsService
  ) { }

  ngOnInit(): void {
    // Listen for any changes invoked on the toolbar events Service and initialise any default behaviour state
    this.subscriptions.push(this.toolbarEventsService.drawMode.subscribe((toggleValue) => {
      this.drawMode = toggleValue;
    }));
  }
  ngOnDestroy(): void {
    // Clean up any subscriptions that we may have
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

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

  public onMouseDown(event: MouseEvent) {
    if (this.annotationSet && this.drawMode) {
      this.drawStartX = event.pageX - (window.scrollX + this.img.nativeElement.getBoundingClientRect().left);
      this.drawStartY = event.pageY - (window.scrollY + this.img.nativeElement.getBoundingClientRect().top);

      this.newRectangle.nativeElement.style.display = 'block';
      this.newRectangle.nativeElement.style.top =  this.drawStartY + 'px';
      this.newRectangle.nativeElement.style.left = this.drawStartX + 'px';

      event.preventDefault();
    }
  }

  public onMouseMove(event: MouseEvent) {
    if (this.annotationSet && this.drawMode && this.drawStartX > 0 && this.drawStartY > 0) {
      this.newRectangle.nativeElement.style.height =
        (event.pageY - this.drawStartY - (window.scrollY + this.img.nativeElement.getBoundingClientRect().top)) + 'px';
      this.newRectangle.nativeElement.style.width =
        (event.pageX - this.drawStartX - (window.scrollX + this.img.nativeElement.getBoundingClientRect().left)) + 'px';

      event.preventDefault();
    }
  }

  public onMouseUp(event: MouseEvent) {
    if (this.annotationSet && this.drawMode) {
      const rectangle = {
        id: uuid(),
        x: +this.newRectangle.nativeElement.style.left.slice(0, -2),
        y: +this.newRectangle.nativeElement.style.top.slice(0, -2),
        width: +this.newRectangle.nativeElement.style.width.slice(0, -2),
        height: +this.newRectangle.nativeElement.style.height.slice(0, -2),
      };

      const annotation = {
        id: uuid(),
        annotationSetId: this.annotationSet.id,
        color: 'FFFF00',
        comments: [],
        page: 1,
        rectangles: [rectangle as Rectangle],
        type: 'highlight'
      };

      this.api
        .postAnnotation(annotation)
        .subscribe(a => this.annotationSet.annotations.push(a));

      this.drawStartX = -1;
      this.drawStartY = -1;
      this.newRectangle.nativeElement.style.display = 'none';
      this.newRectangle.nativeElement.style.width = '0';
      this.newRectangle.nativeElement.style.height = '0';

      event.preventDefault();
    }
  }
}
