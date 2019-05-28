import {Component, Input} from '@angular/core';
import { Subject } from 'rxjs';
import { ActionEvents } from './model/action-events';
import { ToolbarToggles } from './model/toolbar-toggles';
import { SetCurrentPageOperation } from './model/viewer-operations';

@Component({
  selector: 'mv-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['styles/main.scss']
})
export class MediaViewerComponent {

  @Input() url;
  @Input() downloadFileName: string;
  @Input() contentType: string;
  @Input() actionEvents = new ActionEvents();
  @Input() showToolbar = true;

  toolbarToggles = new ToolbarToggles();

  currentPageChanged = new Subject<SetCurrentPageOperation>();
  error: any;

  private supportedContentTypes = ['pdf', 'image'];

  contentTypeUnsupported(): boolean {
    return this.supportedContentTypes.indexOf(this.contentType) < 0;
  }
}
