import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import {MediaViewerMessage} from './media-viewer-message.model';

@Injectable({
  providedIn: 'root'
})
export class MediaViewerMessageService {

  private subject = new Subject<MediaViewerMessage>();

  sendMessage(message: MediaViewerMessage) {
    this.subject.next(message);
  }

  clearMessage() {
    this.subject.next();
  }

  getMessage(): Observable<MediaViewerMessage> {
    return this.subject.asObservable();
  }
}
