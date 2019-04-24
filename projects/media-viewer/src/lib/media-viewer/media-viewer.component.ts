import {Component, Input} from '@angular/core';
import {EmLoggerService} from '../logging/em-logger.service';
import {MediaViewerFeatures} from './media-viewer-features';

@Component({
    selector: 'app-media-viewer',
    templateUrl: './media-viewer.component.html'
})
export class MediaViewerComponent {

  @Input() url = '';
  @Input() contentType: string;
  @Input() mediaViewerFeatures: MediaViewerFeatures = null;

  error: any;

  private supportedContentTypes = ['pdf', 'image'];

  constructor(private log: EmLoggerService) {
      log.setClass('MediaViewerComponent');
  }

  contentTypeUnsupported(): boolean {
    return this.supportedContentTypes.indexOf(this.contentType) < 0;
  }
}
