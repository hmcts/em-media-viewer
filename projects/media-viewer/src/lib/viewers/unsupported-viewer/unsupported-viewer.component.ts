import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter } from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { Subscription } from 'rxjs';
import {MediaLoadStatus, ResponseType} from '../error-message/ViewerException';

@Component({
  selector: 'mv-unsupported-viewer',
  templateUrl: './unsupported-viewer.component.html',
  styleUrls: ['./unsupported-viewer.component.scss']
})
export class UnsupportedViewerComponent implements OnInit, OnDestroy {

  @Input() url: string;
  @Input() originalUrl: string;
  @Input() downloadFileName: string;

  @Output() loadStatus = new EventEmitter<MediaLoadStatus>();

  @ViewChild('downloadLink') downloadLink: ElementRef;

  private subscriptions: Subscription[] = [];

  constructor(
    public readonly toolbarEvents: ToolbarEventService
  ) {}

  public ngOnInit(): void {
    this.subscriptions.push(
      this.toolbarEvents.download.subscribe(() => this.downloadLink.nativeElement.click())
    );
    this.loadStatus.emit({statusType: ResponseType.UNSUPPORTED});
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions that we may have
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
