import { Component, Input, OnInit } from '@angular/core';
import {
  ActionEvents, ChangePageOperation,
  DownloadOperation,
  PrintOperation,
  RotateOperation,
  SearchOperation, SearchResultsCount,
  ZoomOperation
} from './media-viewer.model';
import { Observable, Subject } from 'rxjs';

@Component({
    selector: 'mv-media-viewer',
    templateUrl: './media-viewer.component.html'
})
export class MediaViewerComponent implements OnInit {

  @Input() url = '';
  @Input() downloadFileName = null;
  @Input() contentType: string;
  @Input() actionEvents: ActionEvents;
  rotation: Observable<RotateOperation>;
  search: Observable<SearchOperation>;
  searchResults: Subject<SearchResultsCount>;
  zoom: Observable<ZoomOperation>;
  download: Observable<DownloadOperation>;
  print: Observable<PrintOperation>;
  changePage: Observable<ChangePageOperation>;

  stateChange = new Subject();

  error: any;

  private supportedContentTypes = ['pdf', 'image'];

  ngOnInit(): void {
    if (this.actionEvents) {
      this.rotation = this.actionEvents.rotate;
      this.search = this.actionEvents.search;
      this.searchResults = this.actionEvents.searchResultsCount;
      this.zoom = this.actionEvents.zoom;
      this.download = this.actionEvents.download;
      this.print = this.actionEvents.print;
      this.changePage = this.actionEvents.changePage;
    }
  }

  contentTypeUnsupported(): boolean {
    return this.supportedContentTypes.indexOf(this.contentType) < 0;
  }

}
