import {Component, Input} from '@angular/core';
import {EmLoggerService} from '../logging/em-logger.service';

@Component({
    selector: 'app-media-viewer',
    templateUrl: './media-viewer.component.html'
})
export class MediaViewerComponent {

  @Input() url = '';
  @Input() annotate = false;
  @Input() contentType: string;
  @Input() rotate = false;

  private supportedContentTypes = ['pdf', 'image'];

  constructor(private log: EmLoggerService) {
      log.setClass('MediaViewerComponent');
  }

  contentTypeUnsupported(): boolean {
    return this.supportedContentTypes.indexOf(this.contentType) < 0;
  }
}
