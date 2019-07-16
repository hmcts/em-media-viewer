import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { PrintService } from '../../print.service';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';

@Component({
    selector: 'mv-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
})
export class ImageViewerComponent implements OnInit, OnDestroy, OnChanges {

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() annotationSet: AnnotationSet | null;

  errorMessage: string;

  @ViewChild('img') img: ElementRef;
  rotation = 0;
  zoom = 1;

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly printService: PrintService,
    public readonly toolbarEvents: ToolbarEventService
  ) { }

  ngOnInit(): void {
    // Listen for any changes invoked on the toolbar events Service and initialise any default behaviour state
    this.subscriptions.push(
      this.toolbarEvents.rotate.subscribe(rotation => this.setRotation(rotation)),
      this.toolbarEvents.zoom.subscribe(zoom => this.setZoom(zoom)),
      this.toolbarEvents.stepZoom.subscribe(zoom => this.stepZoom(zoom)),
      this.toolbarEvents.print.subscribe(() => this.printService.printDocumentNatively(this.url)),
      this.toolbarEvents.download.subscribe(() => this.download()),
    );
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
      this.toolbarEvents.reset();
    }
  }

  private setRotation(rotation: number) {
    this.rotation = (this.rotation + rotation + 360) % 360;
  }

  private async setZoom(zoomFactor: number) {
    if (!isNaN(zoomFactor)) {
      await this.setZoomValue(this.calculateZoomValue(zoomFactor));
      this.img.nativeElement.width = this.img.nativeElement.naturalWidth * this.zoom;
    }
  }

  private async stepZoom(zoomFactor: number) {
    if (!isNaN(zoomFactor)) {
      await this.setZoomValue(Math.round(this.calculateZoomValue(this.zoom, zoomFactor) * 10) / 10);
      this.img.nativeElement.width = this.img.nativeElement.naturalWidth * this.zoom;
    }
  }

  private download() {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = this.url;
    a.download = this.downloadFileName;
    a.click();
    a.remove();
  }

  // the returned promise is a work-around
  setZoomValue(zoomValue) {
    return new Promise((resolve) => {
      this.zoom = zoomValue;
      this.toolbarEvents.zoomValue.next(zoomValue);
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
