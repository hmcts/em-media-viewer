import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class CommentService {

  public readonly unsavedChanges = new Subject<boolean>();

  constructor() {}

  onCommentChange(changes: boolean): void {
    this.unsavedChanges.next(changes);
  }

  getUnsavedChanges(): Observable<boolean> {
    return this.unsavedChanges.asObservable();
  }
}
