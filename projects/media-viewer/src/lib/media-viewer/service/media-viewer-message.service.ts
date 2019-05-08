import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { RotateOperation, SearchOperation, ZoomOperation } from './media-viewer-message.model';

@Injectable({
  providedIn: 'root'
})
export class MediaViewerMessageService {

  private rotate = new Subject<RotateOperation>();
  private search = new Subject<SearchOperation>();
  private zoom = new Subject<ZoomOperation>();

  triggerRotation(message: RotateOperation) {
    this.rotate.next(message);
  }

  triggerSearch(message: SearchOperation) {
    this.search.next(message);
  }

  triggerZoom(message: ZoomOperation) {
    this.zoom.next(message);
  }

  rotationEvent(): Observable<RotateOperation> {
    return this.rotate.asObservable();
  }

  searchEvent(): Observable<SearchOperation> {
    return this.search.asObservable();
  }

  zoomEvent(): Observable<ZoomOperation> {
    return this.zoom.asObservable();
  }
}
