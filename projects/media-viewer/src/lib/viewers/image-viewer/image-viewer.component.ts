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
} from '@angular/core';
import { Subscription } from 'rxjs';
import { PrintService } from '../../print.service';
import { AnnotationSet } from '../../annotations/annotation-set/annotation-set.model';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { ResponseType, ViewerException } from '../viewer-exception.model';
import { ViewerUtilService } from '../viewer-util.service';
import { ToolbarButtonVisibilityService } from '../../toolbar/toolbar-button-visibility.service';
import { AnnotationApiService } from '../../annotations/annotation-api.service';
import { Store } from '@ngrx/store';
import * as fromStore from '../../store/reducers/reducers';
import * as fromDocument from '../../store/actions/document.action';

@Component({
    selector: 'mv-image-viewer',
    templateUrl: './image-viewer.component.html'
})
export class ImageViewerComponent implements OnInit, OnDestroy, OnChanges {

  @Input() url: string;
  @Input() downloadFileName: string;

  @Input() enableAnnotations: boolean;
  @Input() annotationSet: AnnotationSet | null;

  @Input() height: string;

  @Output() mediaLoadStatus = new EventEmitter<ResponseType>();
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
  imageHeight: number;
  imageWidth: number;
  imageLeft: number;
  imageTop: number;

  constructor(
    private store: Store<fromStore.AnnotationSetState>,
    private readonly annotationsApi: AnnotationApiService,
    private readonly printService: PrintService,
    private readonly viewerUtilService: ViewerUtilService,
    public readonly toolbarEvents: ToolbarEventService,
    public readonly toolbarButtons: ToolbarButtonVisibilityService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.toolbarEvents.rotateSubject.subscribe(rotation => this.rotateImage(rotation)),
      this.toolbarEvents.zoomSubject.subscribe(zoom => this.setZoom(zoom)),
      this.toolbarEvents.stepZoomSubject.subscribe(zoom => this.stepZoom(zoom)),
      this.toolbarEvents.printSubject.subscribe(() => this.printService.printDocumentNatively(this.url)),
      this.toolbarEvents.downloadSubject.subscribe(() => this.download()),
      this.toolbarEvents.grabNDrag.subscribe(grabNDrag => this.enableGrabNDrag = grabNDrag),
      this.toolbarEvents.commentsPanelVisible.subscribe(toggle => this.showCommentsPanel = toggle)
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

  private rotateImage(rotation: number) {
    this.rotation = (this.rotation + rotation) % 360;
    this.initAnnoPage(this.img.nativeElement);
  }

  private async setZoom(zoomFactor: number) {
    if (!isNaN(zoomFactor)) {
      await this.setZoomValue(this.calculateZoomValue(zoomFactor));
      this.img.nativeElement.width = this.img.nativeElement.naturalWidth * this.zoom;
      this.initAnnoPage(this.img.nativeElement);
    }
  }

  private async stepZoom(zoomFactor: number) {
    if (!isNaN(zoomFactor)) {
      await this.setZoomValue(this.calculateZoomValue(this.zoom, zoomFactor));
      this.img.nativeElement.width = this.img.nativeElement.naturalWidth * this.zoom;
      this.initAnnoPage(this.img.nativeElement);
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
    return +newZoomValue.toFixed(2);
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
    this.mediaLoadStatus.emit(ResponseType.FAILURE);
    this.imageViewerException.emit(this.viewerException);
  }

  onLoad(img: any) {
    this.mediaLoadStatus.emit(ResponseType.SUCCESS);
    this.initAnnoPage(img);
  }

  initAnnoPage(img: any) {
    this.imageHeight = this.rotation % 180 !== 0 ? img.offsetWidth : img.offsetHeight;
    this.imageWidth = this.rotation % 180 !== 0 ? img.offsetHeight : img.offsetWidth;
    this.imageLeft = this.rotation % 180 !== 0 ? img.offsetTop : img.offsetLeft;
    this.imageTop = this.rotation % 180 !== 0 ? img.offsetLeft : img.offsetTop;
    const payload: any = [{
      div: {
        scrollHeight: this.imageHeight,
        scrollWidth: this.imageWidth,
        offsetLeft: this.imageLeft,
      },
      pageNumber: 1,
      scale: this.zoom,
      rotation: this.rotation,
      id: 1
    }];

    this.store.dispatch(new fromDocument.AddPages(payload));
  }

  toggleCommentsSummary() {
    this.toolbarEvents.toggleCommentsSummary(!this.toolbarEvents.showCommentSummary.getValue());
  }
}
