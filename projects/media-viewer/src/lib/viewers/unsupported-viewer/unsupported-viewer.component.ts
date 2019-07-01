import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'mv-unsupported-viewer',
  templateUrl: './unsupported-viewer.component.html',
  styleUrls: ['./unsupported-viewer.component.scss']
})
export class UnsupportedViewerComponent implements OnInit, OnDestroy {
  @Input() url: string;
  @Input() originalUrl: string;
  @Input() downloadFileName: string;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  private subscriptions: Subscription[] = [];

  constructor(
    public readonly toolbarEvents: ToolbarEventService
  ) {}

  public ngOnInit(): void {
    this.subscriptions.push(
      this.toolbarEvents.download.subscribe(() => this.downloadLink.nativeElement.click())
    );
  }

  ngOnDestroy(): void {
    // Clean up any subscriptions that we may have
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

}
