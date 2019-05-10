import { Component, Input, OnInit } from '@angular/core';
import { ActionEvents, GenericOperation, RotateOperation, SearchOperation, ZoomOperation } from './media-viewer.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-media-viewer',
    templateUrl: './media-viewer.component.html'
})
export class MediaViewerComponent implements OnInit {

  @Input() url = '';
  @Input() downloadFileName = null;
  @Input() contentType: string;
  @Input() actionEvents: ActionEvents;
  rotation: Observable<RotateOperation>;
  search: Observable<SearchOperation>;
  zoom: Observable<ZoomOperation>;
  download: Observable<GenericOperation>;
  print: Observable<GenericOperation>;

  error: any;

  private supportedContentTypes = ['pdf', 'image'];

  ngOnInit(): void {
    if (this.actionEvents) {
      this.rotation = this.actionEvents.rotate;
      this.search = this.actionEvents.search;
      this.zoom = this.actionEvents.zoom;
      this.download = this.actionEvents.download;
      this.print = this.actionEvents.print;
    }
  }

  contentTypeUnsupported(): boolean {
    return this.supportedContentTypes.indexOf(this.contentType) < 0;
  }
}
