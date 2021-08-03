import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { Subscription } from 'rxjs';
import { ResponseType } from '../viewer-exception.model';

@Component({
  selector: 'mv-multimedia-player',
  templateUrl: './multimedia-player.component.html'
})
export class MultimediaPlayerComponent implements OnInit, OnChanges, OnDestroy {

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() multimediaOn: boolean;

  @Output() loadStatus = new EventEmitter<ResponseType>();

  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('videoPlayer') videoPlayer: ElementRef;

  playbackMsg = 'loading';

  private subscription: Subscription;

  constructor(
    public readonly toolbarEvents: ToolbarEventService,
  ) {}

  public ngOnInit(): void {
    this.subscription = this.toolbarEvents.downloadSubject
      .subscribe(() => this.downloadLink.nativeElement.click());
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
    if (this.videoPlayer) {
      this.playbackMsg = 'loading';
      this.videoPlayer.nativeElement.load();
    }
  }

  onSuccess() {
    this.playbackMsg = 'success';
  }

  onError() {
    this.playbackMsg = 'error';
  }
}
