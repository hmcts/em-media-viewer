import {Component, Input} from '@angular/core';
import { Observable } from 'rxjs';
import { RotateOperation, SearchOperation, ZoomOperation } from './service/media-viewer-message.model';

@Component({
    selector: 'app-media-viewer',
    templateUrl: './media-viewer.component.html'
})
export class MediaViewerComponent {

  @Input() url = '';
  @Input() contentType: string;
  @Input() rotation: Observable<RotateOperation>;
  @Input() search: Observable<SearchOperation>;
  @Input() zoom: Observable<ZoomOperation>;

  error: any;

  private supportedContentTypes = ['pdf', 'image'];

  contentTypeUnsupported(): boolean {
    return this.supportedContentTypes.indexOf(this.contentType) < 0;
  }
}
