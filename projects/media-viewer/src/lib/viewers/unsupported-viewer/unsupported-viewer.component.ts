import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ToolbarEventService } from '../../toolbar/toolbar-event.service';

@Component({
  selector: 'mv-unsupported-viewer',
  templateUrl: './unsupported-viewer.component.html',
  styleUrls: ['./unsupported-viewer.component.scss']
})
export class UnsupportedViewerComponent implements OnInit {

  @Input() url: string;
  @Input() originalUrl: string;
  @Input() downloadFileName: string;

  @ViewChild('downloadLink') downloadLink: ElementRef;

  constructor(
    public readonly toolbarEvents: ToolbarEventService
  ) {}

  public ngOnInit(): void {
    this.toolbarEvents.download.subscribe(() => this.downloadLink.nativeElement.click());
  }
}
