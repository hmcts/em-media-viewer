import {Component, Input} from '@angular/core';
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

  contentTypeUnsupported(): boolean {
    return this.supportedContentTypes.indexOf(this.contentType) < 0;
  }
}
