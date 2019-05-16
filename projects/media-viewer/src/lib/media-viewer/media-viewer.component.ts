import { Component, Input } from '@angular/core';
import { ActionEvents, SetCurrentPageOperation, ToolbarToggles } from './media-viewer.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'mv-media-viewer',
  templateUrl: './media-viewer.component.html',
  styleUrls: ['styles/main.scss']
})
export class MediaViewerComponent {

  @Input() url = '';
  @Input() downloadFileName = null;
  @Input() contentType: string;
  @Input() actionEvents: ActionEvents;
  @Input() showToolbar = true;

  toolbarToggles = new ToolbarToggles();

  currentPageChanged = new Subject<SetCurrentPageOperation>();
  error: any;

  private supportedContentTypes = ['pdf', 'image'];

  contentTypeUnsupported(): boolean {
    return this.supportedContentTypes.indexOf(this.contentType) < 0;
  }

}
