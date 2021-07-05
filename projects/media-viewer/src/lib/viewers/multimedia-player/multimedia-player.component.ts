import {Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { Subscription } from 'rxjs';
import { ResponseType, ViewerException } from '../viewer-exception.model';
import { ViewerUtilService } from '../viewer-util.service';

@Component({
  selector: 'mv-multimedia-player',
  templateUrl: './multimedia-player.component.html'
})
export class MultimediaPlayerComponent implements OnInit, OnChanges, OnDestroy {

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() multimediaPlayerEnabled: boolean;

  @Output() loadStatus = new EventEmitter<ResponseType>();

  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('videoPlayer') videoPlayer: ElementRef;

  mimeTypeSupported = false;

  private subscription: Subscription;
  private viewerException: ViewerException;

  constructor(
    public readonly toolbarEvents: ToolbarEventService,
    private readonly viewerUtilService: ViewerUtilService,
  ) {}

  public ngOnInit(): void {
    this.subscription = this.toolbarEvents.downloadSubject.subscribe(() => this.downloadLink.nativeElement.click());
    this.subscription.add(
      this.viewerUtilService.validateFile(this.url).subscribe(
        next => next,
        error => {
          this.viewerException = new ViewerException(error.name,
            { httpResponseCode: error.status, message: error.message });
        }
      )
    );
    this.loadStatus.emit(ResponseType.SUCCESS);
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.url) {
      this.reloadVideo();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  reloadVideo() {
    this.mimeTypeSupported = false;
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.load();
    }
  }

  confirmVideoSupported() {
    this.mimeTypeSupported = true;
  }
}
