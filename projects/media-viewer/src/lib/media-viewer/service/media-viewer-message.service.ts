import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import {
  RotateOperation,
  SearchOperation,
  ZoomOperation
} from './media-viewer-message.model';

@Injectable({
  providedIn: 'root'
})
export class MediaViewerMessageService {

  actionEvents() {
    return {
      rotate: new Subject<RotateOperation>(),
      search: new Subject<SearchOperation>(),
      zoom: new Subject<ZoomOperation>()
    };
  }
}
