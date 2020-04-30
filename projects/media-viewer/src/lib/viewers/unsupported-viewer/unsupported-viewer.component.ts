import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { Subscription } from 'rxjs';
import { ResponseType, ViewerException } from '../viewer-exception.model';
import { ViewerUtilService } from '../viewer-util.service';

@Component({
  selector: 'mv-unsupported-viewer',
  templateUrl: './unsupported-viewer.component.html'
})
export class UnsupportedViewerComponent implements OnInit, OnDestroy {

  @Input() url: string;
  @Input() originalUrl: string;
  @Input() downloadFileName: string;
  @Input() typeException: boolean;

  @Output() loadStatus = new EventEmitter<ResponseType>();
  @Output() unsupportedViewerException = new EventEmitter<ViewerException>();

  @ViewChild('downloadLink') downloadLink: ElementRef;

  private subscriptions: Subscription[] = [];
  private viewerException: ViewerException;

  constructor(
    public readonly toolbarEvents: ToolbarEventService,
    private readonly viewerUtilService: ViewerUtilService,
  ) {}

  public ngOnInit(): void {
    this.subscriptions.push(
      this.toolbarEvents.downloadSubject.subscribe(() => this.downloadLink.nativeElement.click()),
      this.viewerUtilService.validateFile(this.url).subscribe(
        next => next,
        error => {
          this.viewerException = new ViewerException(error.name,
            { httpResponseCode: error.status, message: error.message });
        }
      )
    );

    this.loadStatus.emit(ResponseType.UNSUPPORTED);

    if (!this.typeException) {
      this.unsupportedViewerException.emit(this.viewerException);
    }
  }

  ngOnDestroy(): void {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
