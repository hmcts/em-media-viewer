import {
  AfterContentInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
  defaultImageOptions,
  defaultPdfOptions,
  defaultUnsupportedOptions,
  ToolbarButtonVisibilityService
} from './toolbar/toolbar-button-visibility.service';
import { AnnotationSet } from './annotations/annotation-set/annotation-set.model';
import { ToolbarEventService } from './toolbar/toolbar-event.service';
import { AnnotationApiService } from './annotations/annotation-api.service';

@Component({
  selector: 'mv-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['styles/main.scss', './media-viewer.component.scss']
})
export class MediaViewerComponent implements OnChanges, AfterContentInit {

  @Input() downloadFileName: string;
  @Input() contentType: string;
  @Input() showToolbar = true;

  @Output() mediaLoadStatus = new EventEmitter<string>();

  @Input() enableAnnotations = false;
  @Input() showCommentSummary: Subject<boolean>;

  _url: string;
  annotationSet: Observable<AnnotationSet>;



  private supportedContentTypes = ['pdf', 'image'];

  constructor(
    public readonly toolbarButtons: ToolbarButtonVisibilityService,
    public readonly toolbarEvents: ToolbarEventService,
    private readonly api: AnnotationApiService
  ) {}

  ngAfterContentInit() {
    this.setToolbarButtons();
  }

  @Input()
  set url(url: string) {
    this._url = url;
    if (this.enableAnnotations) {
      this.annotationSet = this.api.getOrCreateAnnotationSet(url);
    }
  }

  get url() {
    return this._url;
  }

  contentTypeUnsupported(): boolean {
    return this.supportedContentTypes.indexOf(this.contentType) < 0;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.url) {
      this.setToolbarButtons();
      this.toolbarEvents.reset();
    }
  }

  onMediaLoad(status: string) {
    this.mediaLoadStatus.emit(status);
  }

  setToolbarButtons() {
    if (this.contentType === this.supportedContentTypes[0]) {
      this.toolbarButtons.reset({ ...defaultPdfOptions, showHighlight: this.enableAnnotations });
    } else if (this.contentType === this.supportedContentTypes[1]) {
      this.toolbarButtons.reset({ ...defaultImageOptions, showHighlight: this.enableAnnotations });
    } else {
      this.toolbarButtons.reset({ ...defaultUnsupportedOptions });
    }
  }
}
