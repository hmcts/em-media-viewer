import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface SelectionAnnotation {
  annotationId: string;
  editable: boolean;
}

@Injectable()
export class AnnotationEventService {

  public readonly selectedAnnotation = new Subject<SelectionAnnotation>();
  public readonly commentSearch = new Subject<string>();
  public readonly resetHighlightEvent = new Subject();

  constructor() {}

  public selectAnnotation(annotation: SelectionAnnotation): void {
    this.selectedAnnotation.next(annotation);
  }

  getSelectedAnnotation(): Observable<SelectionAnnotation> {
    return this.selectedAnnotation.asObservable();
  }

  onCommentSearch(searchString: string) {
    this.commentSearch.next(searchString);
  }

  resetTextHighlight() {
    this.resetHighlightEvent.next();
  }
}
