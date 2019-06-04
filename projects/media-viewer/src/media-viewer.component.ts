import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ActionEvents } from './events/action-events';
import { getToolbarButtonToggles, ToolbarButtonToggles } from './events/toolbar-button-toggles';
import { SetCurrentPageOperation } from './events/viewer-operations';

@Component({
  selector: 'mv-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['styles/main.scss']
})
export class MediaViewerComponent implements OnInit {

  @Input() url: string;
  @Input() downloadFileName: string;
  @Input() contentType: string;
  @Input() actionEvents = new ActionEvents();
  @Input() showToolbar = true;
  @Input() toolbarButtonToggles: ToolbarButtonToggles;

  currentPageChanged = new Subject<SetCurrentPageOperation>();
  error: any;

  private supportedContentTypes = ['pdf', 'image'];

  ngOnInit(): void {
    if (!this.toolbarButtonToggles) {
      this.toolbarButtonToggles = getToolbarButtonToggles(this.contentType);
    }
  }

  contentTypeUnsupported(): boolean {
    return this.supportedContentTypes.indexOf(this.contentType) < 0;
  }
}
