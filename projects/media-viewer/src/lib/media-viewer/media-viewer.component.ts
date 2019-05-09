import { Component, Input, OnInit } from '@angular/core';
import { ActionEvents, RotateOperation, SearchOperation, ZoomOperation } from './media-viewer.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-media-viewer',
    templateUrl: './media-viewer.component.html'
})
export class MediaViewerComponent implements OnInit {

  @Input() url = '';
  @Input() contentType: string;
  @Input() actionEvents: ActionEvents;
  rotation: Observable<RotateOperation>;
  search: Observable<SearchOperation>;
  zoom: Observable<ZoomOperation>;

  error: any;

  private supportedContentTypes = ['pdf', 'image'];

  ngOnInit(): void {
    if (this.actionEvents) {
      this.rotation = this.actionEvents.rotate;
      this.search = this.actionEvents.search;
      this.zoom = this.actionEvents.zoom;
    }
  }

  contentTypeUnsupported(): boolean {
    return this.supportedContentTypes.indexOf(this.contentType) < 0;
  }
}
