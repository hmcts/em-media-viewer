import { Component, Input } from '@angular/core';
import { ActionEvents, ToolbarToggles } from './media-viewer.model';

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

  toolbarToggles = new ToolbarToggles();

  error: any;

  private supportedContentTypes = ['pdf', 'image'];

  contentTypeUnsupported(): boolean {
    return this.supportedContentTypes.indexOf(this.contentType) < 0;
  }
}
