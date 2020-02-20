import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Subscription} from 'rxjs';
import {PrintService} from '../../print.service';
import {AnnotationSet} from '../../annotations/annotation-set/annotation-set.model';
import {ToolbarEventService} from '../../toolbar/toolbar-event.service';
import {ResponseType, ViewerException} from '../error-message/viewer-exception.model';
import {ViewerUtilService} from '../viewer-util.service';
import {ViewerEventService} from '../viewer-event.service';
import {ToolbarButtonVisibilityService} from '../../toolbar/toolbar-button-visibility.service';
import { take } from 'rxjs/operators';
import { AnnotationApiService } from '../../annotations/annotation-api.service';

@Component({
    selector: 'mv-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss', '../../media-viewer.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ImageViewerComponent implements OnInit, OnDestroy, OnChanges {

  @Input() url: string;
  @Input() downloadFileName: string;

  @Input() enableAnnotations: boolean;
  @Input() annotationSet: AnnotationSet | null;

  @Input() height: string;

  @Output() imageLoadStatus = new EventEmitter<ResponseType>();
  @Output() imageViewerException = new EventEmitter<ViewerException>();

  errorMessage: string;

  @ViewChild('img') img: ElementRef;
  rotation = 0;
  zoom = 1;

  private subscriptions: Subscription[] = [];
  private viewerException: ViewerException;
  private response: Subscription;

  showCommentsPanel: boolean;
  enableGrabNDrag = false;

  constructor(
    private readonly annotationsApi: AnnotationApiService,
    private readonly printService: PrintService,
    private readonly viewerUtilService: ViewerUtilService,
    private readonly viewerEvents: ViewerEventService,
    public readonly toolbarEvents: ToolbarEventService,
    public readonly toolbarButtons: ToolbarButtonVisibilityService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.toolbarEvents.drawModeSubject.subscribe(drawMode => this.setupAnnotationSet(drawMode)),
      this.toolbarEvents.highlightModeSubject.subscribe(highlightMode => this.setupAnnotationSet(highlightMode)),
      this.toolbarEvents.rotateSubject.subscribe(rotation => this.setRotation(rotation)),
      this.toolbarEvents.zoomSubject.subscribe(zoom => this.setZoom(zoom)),
      this.toolbarEvents.stepZoomSubject.subscribe(zoom => this.stepZoom(zoom)),
      this.toolbarEvents.printSubject.subscribe(() => this.printService.printDocumentNatively(this.url)),
      this.toolbarEvents.downloadSubject.subscribe(() => this.download()),
      this.toolbarEvents.grabNDrag.subscribe(grabNDrag => this.enableGrabNDrag = grabNDrag),
      this.viewerEvents.commentsPanelVisible.subscribe(toggle => this.showCommentsPanel = toggle)
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.filter(subscription => !subscription.closed)
      .forEach(subscription => subscription.unsubscribe());
    if (this.response) {
      this.response.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.url) {
      this.errorMessage = null;
      this.toolbarEvents.reset();
    }
  }

  setupAnnotationSet(mode: boolean) {
    if (mode && !this.annotationSet) {
      this.annotationsApi.getOrCreateAnnotationSet(this.url)
        .pipe(take(1))
        .subscribe(annotationSet => {
          this.annotationSet = annotationSet;
          console.log('annotation set', this.annotationSet)
        });
    }
  }

  private setRotation(rotation: number) {
    this.rotation = (this.rotation + rotation) % 360;
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
      this.toolbarEvents.zoomValueSubject.next(zoomValue);
      resolve(true);
    });
  }

  calculateZoomValue(zoomValue, increment = 0) {
    const newZoomValue = zoomValue + increment;
    if (newZoomValue > 5) { return 5; }
    if (newZoomValue < 0.1) { return 0.1; }
    return newZoomValue;
  }

  onLoadError(url) {
    this.response = this.viewerUtilService.validateFile(url)
      .subscribe(
      next => next,
      error => {
        this.viewerException = new ViewerException(error.name,
          {httpResponseCode: error.status, message: error.message});
      });

    this.errorMessage = `Could not load the image "${this.url}"`;
    this.imageLoadStatus.emit(ResponseType.FAILURE);
    this.imageViewerException.emit(this.viewerException);
  }

  onLoad() {
    this.imageLoadStatus.emit(ResponseType.SUCCESS);
  }

  getImageHeight(img) {
    return this.rotation % 180 !== 0 ? img.offsetWidth + 15 : img.offsetHeight + 15;
  }

  toggleCommentsSummary() {
    this.toolbarEvents.toggleCommentsSummary(!this.toolbarEvents.showCommentSummary.getValue());
  }
}
